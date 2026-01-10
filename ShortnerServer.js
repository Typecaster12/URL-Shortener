const http = require('http');
const fs = require('fs');
const queryString = require('querystring');

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


            let data = {};

            if (fs.existsSync('storage.json')) {
                const fileContent = fs.readFileSync('storage.json', 'utf-8').trim();

                if (fileContent) {
                    data = JSON.parse(fileContent);
                }
            }

            //for uniqueness of alias
            if (data[alias]) {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end("Alias already exists. Choose another one.");
                return;
            }

            //url validation;
            try {
                new URL(mainUrl);
            } catch {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end("Invalid URL format.");
                return;
            }


            //merg the data now,
            data[alias] = {
                url: mainUrl,
                timeStamp: new Date().toISOString(),
                clicks: 0
            }

            //finally making json data out of final data we get,
            fs.writeFileSync('storage.json', JSON.stringify(data, null, 2));

            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end(`Short link created: /${alias}`);
        });
    }
});

server.listen(3500);