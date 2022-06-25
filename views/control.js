const fs = require('fs');

class Template{
    constructor(){
        this.openArea = "{{>";
        this.closeArea = "}}";
        this.openView = "{{{";
        this.closeView = "}}}";
        this.openCode = "{{";
        this.closeCode = "}}";
        this.openAdd = "{{#";
        this.closeAdd = "}}";
        this.path = './views/templates/';
        this.extend = 'html'
        this.layout = 'main';
    }

    set(name, value){
        this[name] = value;
        if(name == 'path'){
            let l = this.path.length - 1;
            if(this.path[l] != '/' && this.path[l] != '\\')
                this.path += '/';
        }
    }
    //get elements of layout
    templateElements(){
        try{
            let content = fs.readFileSync(this.path + 'layouts/' + this.layout + '.' + this.extend).toString();
            let template = {
                content: content,
                subs: [],
                mains: [],
                add:[]

            };
            let subStart = content.indexOf(this.openArea, 0);
            let openAreaLength = this.openArea.length;
            let closeAreaLength = this.closeArea.length;
            //
            let mainStart = content.indexOf(this.openView, 0);
            let openViewLength = this.openView.length;
            let closeViewLength = this.closeView.length;
            //
            let addStart = content.indexOf(this.openAdd, 0);
            let openAddLength = this.openAdd.length;
            let closeAddLength = this.closeAdd.length;
            while(subStart > -1 || mainStart > -1){
                if(subStart >= 0){
                    let subsEnd = content.indexOf(this.closeArea, subStart);
                    if(subsEnd > 0){
                        template.subs.push({
                        name:content.substring(subStart + openAreaLength, subsEnd),
                        pos:{
                            subStart: subStart,
                            subsEnd: subsEnd + closeAreaLength
                        }
                        });
                    }
                    else{
                        subsEnd = content.length;
                    }
                    subStart = content.indexOf(this.openArea, subsEnd);
                }

                if(mainStart >= 0){
                    let mainEnd = content.indexOf(this.closeView, mainStart);
                    if(mainEnd > 0){
                        template.mains.push({
                        name:content.substring(mainStart + openViewLength, mainEnd),
                        pos:{
                            mainStart: mainStart,
                            mainEnd: mainEnd + closeViewLength
                        }
                        });
                    }
                    else{
                        mainEnd = content.length;
                    }
                    mainStart = content.indexOf(this.openView, mainEnd);
                }

                if(addStart >= 0){
                    let addEnd = content.indexOf(this.closeAdd, addStart);
                    if(addEnd > 0){
                        template.add.push({
                        name:content.substring(addStart + openAddLength, addEnd),
                        pos:{
                            addStart: addStart,
                            addEnd: addEnd + closeAddLength
                        }
                        });
                    }
                    else{
                        addEnd = content.length;
                    }
                    addStart = content.indexOf(this.openAdd, addEnd);
                }
            }
            return template;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }
    //get code of elements to layout
    asignElementToTemplate(view, options = {layouts:true}){
        let template = this.templateElements();
        console.log(template);
        let content = template.content;
        //subs
        let subLoop = template.subs.length;
        let subs = template.subs;
        //mains
        let mainLoop = template.mains.length;
        let mains = template.mains;
        //add
        let addLoop = template.add.length;
        let add = template.add;
        //subs
        if(options.layouts){
            for(let i = 0; i < subLoop; i++){
                try{
                    let filePath = this.path + "layouts/" + subs[i].name + '.' + this.extend;
                    if(fs.existsSync(filePath)){
                        let fileContent = fs.readFileSync(filePath);
                        content = content.replace(this.openArea + subs[i].name + this.closeArea, fileContent);
                    }
                    else{
                        content = content.replace(this.openArea + subs[i].name + this.closeArea, "");
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else{
            for(let i = 0; i < subLoop; i++){
                content = content.replace(this.openArea + subs[i].name + this.closeArea, "");
            }
        }
        //main
        for(let i = 0; i < mainLoop; i++){
            try{
                let filePath = this.path + view + '.' + this.extend;
                if(fs.existsSync(filePath)){
                    let fileContent = fs.readFileSync(filePath);
                    content = content.replace(this.openView + mains[i].name + this.closeView, fileContent);
                }
                else{
                    content = content.replace(this.openView + mains[i].name + this.closeView, "");
                }
            }
            catch(err){
                console.log(err);
            }
        }
        //add
        for(let i = 0; i < addLoop; i++){
            let src = add[i].name.slice(add[i].name.indexOf(":"));
            src = src.slice(1);
            src = src.trim();
            try{
                if(fs.existsSync(src)){
                    let fileContent = fs.readFileSync(src);
                    fileContent = "<script>" + fileContent + "</script>";
                    content = content.replace(this.openAdd + add[i].name + this.closeAdd, fileContent);
                }
                else{
                    content = content.replace(this.openAdd + add[i].name + this.closeAdd, "");
                }
            }
            catch(err){
                console.log(err);
            }
        }
        return content;
    }
    //replace template to html code
    templateToHtml(content, data = {}){
        data = JSON.stringify(data);
        if(data){
            data = "data = " + data + ";";
        }
        else{
            data = "data = null";
        }

        let startCodeArea = content.indexOf(this.openCode);
        let openCodeLength = this.openCode.length;
        let closeCodeLength = this.closeCode.length;
        while(startCodeArea > -1){
            let endCode = content.indexOf(this.closeCode, startCodeArea);
            let codeArea = content.substring(startCodeArea, endCode + closeCodeLength);
            console.log(codeArea);
            let code = codeArea.substring(openCodeLength, codeArea.length - closeCodeLength);
            code = data +  "try{" + code  + "}catch(err){console.log(err);}";
            code = new Function(code);
            let value = code();
            content = content.replace(codeArea, value);
            startCodeArea = content.indexOf(this.openCode);
        }
        return content;
    }

    render(res, view, data = {}, options = {layouts: true}){
        let content = this.asignElementToTemplate(view, options);
        content = this.templateToHtml(content, data);
        res.end(content);
    }
}

module.exports = new Template;