const fs = require('fs');


class Template{
    constructor(){
        this.path = '123';
        this.pathLayouts = this.path + "layouts";
        this.openCommand = "{{";
        this.closeCommand = "}}";
        this.openArea = "{{{";
        this.closeArea = "}}}";
        this.commands = [
            {
                start:"#if",
                end:"#endIf"
            }
        ];
    }

    setPath(path){
        this.path = path;
        let l = this.path.length - 1;
        if(this.path[l] != '/' && this.path[l] != '\\')
            this.path + '/';
        this.pathLayouts = this.path + "layouts/";
    }

    setPathLayout(path){
        let l = this.pathLayouts.length - 1;
        if(this.pathLayouts[l] != '/' && this.pathLayouts[l] != '\\')
            this.pathLayouts + '/';
    }

    processData(content, data = {}){
        let startCommand = content.indexOf(this.openCommand);
        data = JSON.stringify(data);
        if(data){
            data = "data = " + data + ";";
        }
        else{
            data = "1";
        }
        
        console.log("DATA:" + data);
        while(startCommand > -1){
            let endCommand = content.indexOf(this.closeCommand, startCommand) + 2;
            let command = content.substring(startCommand, endCommand);
            let realCommand = command.substring(2, command.length - 2);
            realCommand = data +  "try{" + realCommand  + "}catch(err){console.log(err);}";
            let func = new Function(realCommand);
            let vl = func();
            content = content.replace(command, vl);
            startCommand = content.indexOf(this.openCommand);
        }
        return content;
    }

    render(res, fileName, data, options = {layout:false}){
        fs.readFile(this.path + fileName, (err, content) => {
            if(!err){
                content = this.processData(content.toString(), data);
                if(!options.layout){
                    res.write(content.toString());
                    res.end();
                }
                else{
                    fs.readdir(this.pathLayouts, (err, data) => {
                        console.log(data);
                    })
                    res.end("END");
                }
            }
            else{
                res.end(err.toString());
            }
        });
    }
}

module.exports = new Template;