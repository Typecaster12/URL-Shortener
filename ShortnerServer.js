const http = require('http');
const fs = require('fs');
const queryString = require('querystring');
const { log } = require('console');

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
    } else if (req.url === '/submit' && req.method === 'POST') {
        //will store the data in normal text first, then use this as useable formate;
        let textData = "";
        req.on('data', (chunk) => {
            textData += chunk.toString();
        });

        req.on('end', () => {
            //object containing mainUrl and alias;
            let dataObject = queryString.parse(textData);

            //for alias formate validation
            const aliasPattern = /^[a-zA-Z0-9_-]+$/;

            //store into variable to check for some validations;
            let mainUrl = dataObject.mainUrl;
            let alias = dataObject.alias;

            //into proper object formate;
            //!currently not in use..
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

            //if file is already there?
            if (fs.existsSync('storage.json')) {
                //this contains the data(object) from json file;
                const fileContent = fs.readFileSync('storage.json', 'utf-8').trim();
                console.log("fileContent is : " + fileContent);//for debug;
                //if fileContent have some data, parse that data into json data(make it json);
                if (fileContent) {
                    data = JSON.parse(fileContent);
                    // console.log("Logged data : " + data);//for debug;
                }
            }

            //contains actual json data;
            console.log(data);

            //for uniqueness of alias
            // console.log("data[alias]" + data[alias]);
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
                url: mainUrl, //the url of that alias;
                timeStamp: new Date().toISOString(), //timeStamp;
                clicks: 0 //no. of times we make request with same alias;
            }

            //finally making json data out of final data we get,
            fs.writeFileSync('storage.json', JSON.stringify(data, null, 2));

            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end(`Short link created: /${alias}`);
        });
    } else {
        //now the final part, we have to make Get request here so that use can get the response;
        const getAlias = req.url.slice(1);//as our url have /ouralias => se we will get only alias and (/) is removed;

        let getData = {};
        //reading the json file to check if we have alias present in our storage file(json);
        //but first check if we have file
        //!we have done this process before but as this is for get request, 
        if (fs.existsSync('Storage.json')) {
            //read
            const getFileContent = fs.readFileSync('storage.json', 'utf-8').trim();

            if (getFileContent) {
                getData = JSON.parse(getFileContent);
            }
        }

        //if we have same alais already present there then we have to update the number of clicks;
        if (getData[getAlias]) {
            //clicks update;
            getData[getAlias].clicks += 1;

            //update the changes to the file;
            fs.writeFileSync('storage.json', JSON.stringify(getData, null, 2));

            //rediricting the user with 302 status code;
            res.writeHead(302, {
                location: getData[getAlias].url,
            });

            console.log(req.url);
            //ending the response;
            res.end(`Short link created: /${alias}`);
        } else {
            res.writeHead(400, { 'content-type': 'text/plain' });
            res.end("Short link not found");
        }
    }
});

server.listen(3500);