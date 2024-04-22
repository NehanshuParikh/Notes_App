const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    fs.readdir("./Notes", (err, Files) => {
        res.render("index", { File: Files, error: '', DeleteMsg: '', successMsg: '', fileCreationError: '', fileEditedMsg: '' });
    })
})

app.post('/create', (req, res) => {
    let filename = req.body.heading.split(' ').join('_')

    fs.readdir('./Notes', (err, Files) => {
        if (Files.includes(`${filename}.txt`)) {
            res.render('index', { File: Files, error: '', DeleteMsg: '', successMsg: '', fileCreationError: 'File Already Found In The System.Try With different File Name' });
        } else {
            fs.writeFile(`./Notes/${filename}.txt`, `${req.body.dets}`, (err) => {

                // checking if the filename already exsists in the directory or not       
                let createdMsg = "Note Created Successfully";
                res.render('index', { File: Files, error: '', DeleteMsg: '', successMsg: createdMsg });

            })
        }
    })

})

app.post('/delete', (req, res) => {
    fs.unlink(`./Notes/${req.body.FileToDelete}`, (err) => {
        if (err) {
            let error = "Sorry, An Error Occurred !";
            fs.readdir("./Notes", (err, Files) => {
                res.render("index", { File: Files, error: error, DeleteMsg: '', successMsg: '' });
            });
        } else {
            let DeleteMsg = "Message Deleted Succefully!"
            fs.readdir("./Notes", (err, Files) => {
                res.render("index", { File: Files, error: '', DeleteMsg: DeleteMsg, successMsg: '' });
            });
        }
    })
})

app.get('/Notes/:filename', (req, res) => {
    fs.readFile(`./Notes/${req.params.filename}`, 'utf-8', (err, filedata) => {
        res.render('show', { heading: req.params.filename, data: filedata })
    })
})

app.get(`/edit/:filetoedit`, (req, res) => {
    fs.readFile(`./Notes/${req.params.filetoedit}`, 'utf-8', (err, filedata) => {
        res.render('edit', { heading: req.params.filetoedit, data: filedata })
    })
})
app.post(`/edit`, (req, res) => {
    fs.readdir(`./Notes`, (err, files) => {
        if (files.includes(req.body.heading)) {
            fs.writeFile(`./Notes/${req.body.heading}`, `${req.body.dets}`, (err, filedata) => {
                res.render("index", { File: '', error: '', DeleteMsg: '', successMsg: '', fileCreationError: '', fileEditedMsg: 'File Edited Successfully' });
            })
        } else {
            fs.rename(`./Notes/${req.body.currentAddress}`, `./Notes/${req.body.heading}`, (err) => {
                // Edit renamed file
                fs.writeFile(`./Notes/${req.body.heading}`, `${req.body.dets}`, (err, filedata) => {
                    res.render("index", { File: '', error: '', DeleteMsg: '', successMsg: '', fileCreationError: '', fileEditedMsg: 'File Edited Successfully' });
                })
            });
        }
    })
})

app.get('/comebacktohome', (req, res) => {
    res.redirect('/');
})

app.listen(3000);