const http = require('http');
const fs = require('fs');
const queryString = require('querystring');
const { url } = require('inspector');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        //form rendering;
        fs.readFile('Form.html', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' })
                res.end("Intenal Server error");
                return;
            }

            res.writeHead(200, { 'content-type': 'text/html' });
            res.write(data);
            res.end();
        });
    } if (req.url === '/submit' && req.method === 'POST') {
        //will store the data in normal text first, then use this as useable formate;
        let textData = "";

        req.on('data', (chunk) => {
            textData += chunk.toString();
        });

        req.on('end', () => {
            let dataObject = queryString.parse(textData);

            //for alias formate validation
            const aliasPattern = /^[a-zA-Z0-9_-]+$/;

            //store into variable to check for some validations;
            let mainUrl = dataObject.mainUrl;
            let alias = dataObject.alias;

            //into proper object formate;
            let finalDataObject = {
                mainUrl,
                alias // <!--“Alias” means: a chosen nickname that points to something real-->
            }

            //check if the input is not empty;
            if (!mainUrl || !alias) {
                res.writeHead(400, { 'content-type': 'text/plain' });
                res.end("Both alias and Url required..");
                return;
            }

            //alias should be in proper formate;
            if (!aliasPattern.test(alias)) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end("Alias contains invalid characters.");
                return;
            }

            //for uniqueness of alias
            if (data[alias]) {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end("Alias already exists. Choose another one.");
                return;
            }

            //url validation;
            try {
                new url(mainUrl);
            } catch {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end("Invalid URL format.");
                return;
            }


            console.log(finalDataObject);
        });

        res.end();
    }
});

server.listen(3500);