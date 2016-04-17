var express = require('express');
var bodyParser = require('body-parser');
var mime = require('mime');
var drive = require('./drive');
var fs = require("fs");
var pathModule = require('path');
var EasyZip = require('easy-zip').EasyZip;
var http = require('http');
var ytdl = require('ytdl-core');

var indexFileDir = __dirname + "/" + "index.html";
var homePageDir = __dirname + "/" + "home.html";
var myDrive = "/home/healthut";

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.sendFile(indexFileDir);
});

app.get('/home', function(req, res) {
	res.sendFile(homePageDir);
});

app.post('/login', function(req, res) {
	if (req.body.username == "ashish" && req.body.password == "a") {
		res.sendFile(homePageDir);
	} else {
		res.sendFile(indexFileDir);
	}
});

app.get('/rootDir', function(req, res) {
	res.end(myDrive);
});

app.post('/list', function(req, res) {
	console.log(req.body.path);
	res.end(JSON.stringify(drive.getFilesList(req.body.path)));
});

app.post('/createDirectory', function(req, res) {
	res.end(JSON.stringify(drive.createDirectory(req.body.path, req.body.name)));
});

app.post('/deleteDirectory', function(req, res) {
	res.end(JSON.stringify(drive.deleteDirectory(req.body.path)));
});

app.post('/copy', function(req, res) {
	res.end(JSON.stringify(drive.copy(req.body.path, req.body.targetParent)));
});

app.post('/cut', function(req, res) {
	res.end(JSON.stringify(drive.cut(req.body.path, req.body.targetParent)));
});

app.post('/delete', function(req, res) {
	res.end(JSON.stringify(drive.deletePath(req.body.path)));
});

app.post('/parentName', function(req, res) {
	res.end(pathModule.join(req.body.path, '..'));
});

app.post('/download', function(req, res) {
	var path = req.body.path;
	if (drive.isDirectory(path)) {
		var folderName = pathModule.basename(path);
		var zip = new EasyZip();
		zip.zipFolder(path, function() {
			zip.writeToResponse(res, folderName);
		});
	} else {
		res.download(req.body.path);
	}
});

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

app.post('/uploadUrl', function(req, res) {
	var type = req.body.type;
	var fileToDownload = req.body.url;
	console.log("file to download = " + fileToDownload);
	var currentDir = req.body.currentDir;
	var fileName = req.body.fileName;
	console.log("type = " + type);
	console.log('type.trim() == "URL  :::  ' + (type.trim() == "URL"));
	if (type.trim() == "URL") {
		var filePathToSave = pathModule.join(currentDir, fileName);
		var fileWriteStream = fs.createWriteStream(filePathToSave);
		var request = http.get(fileToDownload, function(response) {
			response.pipe(fileWriteStream);
		});
	} else if (type == 'TORRENT') {
		console.log('downloading torrent');
		drive.downloadTorrent(fileToDownload, currentDir);
	} else if (type == 'YOUTUBE') {
		ytdl(fileToDownload)
			.pipe(fs.createWriteStream(pathModule.join(currentDir, fileName)));
	}
});

var server = app.listen(60992, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening at http://%s:%s", 'localhost', port);
});
