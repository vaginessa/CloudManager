var fs = require('fs');
var ncp = require('ncp').ncp;
var pathModule = require('path');
var rmdir = require('rimraf');
var Client = require('node-torrent');

module.exports = {

	downloadTorrent: function(magnetURI, parentDir) {
		
		var client = new Client({ logLevel: 'DEBUG' });
		var torrent = client.addTorrent(magnetURI);

		// when the torrent completes, move it's files to another area 
		torrent.on('complete', function() {
			console.log('complete!');
			torrent.files.forEach(function(file) {
				var newPath = pathModule.join(parentDir, "/newPath", file.path);
				fs.rename(file.path, newPath);
				// while still seeding need to make sure file.path points to the right place 
				file.path = newPath;
			});
		});
	},

	getFilesList: function(path) {
		var items = fs.readdirSync(path);
		var filesList = [];
		for (var i = 0; i < items.length; i++) {
			var file = pathModule.join(path, items[i]);
			stats = fs.lstatSync(file);
			filesList.push({
				"fileName": items[i],
				"size": stats['size'],
				"isDir": stats.isDirectory(),
				"filePath": file,
				"fileIcon": this.getFileMime(file, stats.isDirectory())
			});
		}
		return filesList;
	},

	isDirectory: function(path) {
		return fs.lstatSync(path).isDirectory();
	},

	createDirectory: function(dirPath, name) {
		dirPath = pathModule.join(dirPath, name)
		fs.mkdir(dirPath, function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("Directory created successfully!");
		});
	},

	deletePath: function(path) {
		if (isDirectory(path)) {
			rmdir(path, function(error) {});
		} else {
			fs.unlinkSync(filePath);
		}
	},

	downloadDirectory: function(path) {

	},

	copy: function(path, targetParent) {
		var folderName = pathModule.basename(path);
		var finalDestination = pathModule.join(targetParent, folderName);
		if (isDirectory(source)) {
			ncp(source, finalDestination, function(err) {
				if (err) {
					return console.error(err);
				}
			});
		} else {
			var sourceStream = fs.createReadStream(path);
			var destStream = fs.createWriteStream(finalDestination);
			sourceStream.pipe(destStream);
			sourceStream.on('end', function() {});
			sourceStream.on('error', function(err) { /* error */ });
		}
	},

	cut: function(source, targetParentDir) {
		var folderName = pathModule.basename(path);
		var finalDestination = pathModule.join(targetParentDir, folderName);
		if (isDirectory(source)) {
			ncp(source, finalDestination, function(err) {
				if (err) {
					return console.error(err);
				} else {
					rmdir(source, function(error) {});
				}
			});
		} else {
			var sourceStream = fs.createReadStream(source);
			var destStream = fs.createWriteStream(finalDestination);
			sourceStream.pipe(destStream);
			source.on('end', function() {
				fs.unlinkSync(filePath);
			});
			sourceStream.on('error', function(err) { /* error */ });
		}
	},

	getFileMime: function(path, isDir) {
		if (isDir) {
			return 'fa fa-folder';
		}
		var ext = pathModule.extname(path);
		switch (ext) {
			case '.doc':
				return 'fa fa-file-word-o';
			case '.docx':
				return 'fa fa-file-word-o';
			case '.ppt':
				return 'fa fa-file-powerpoint-o';
			case '.pptx':
				return 'fa fa-file-powerpoint-o';
			case '.xlsx':
				return 'fa fa-file-excel-o';
			case '.xml':
				return 'fa fa-file-excel-o';
			case '.srt':
				return 'fa fa-file-text-o';
			case '.txt':
				return 'fa fa-file-text-o';
			case '.jpg':
				return 'fa fa-file-image-o';
			case '.png':
				return 'fa fa-file-image-o';
			case '.gif':
				return 'fa fa-file-image-o';
			case '.zip':
				return 'fa fa-file-archive-o';
			case '.tar':
				return 'fa fa-file-archive-o';
			case '.gz':
				return 'fa fa-file-archive-o';
			case '.rar':
				return 'fa fa-file-archive-o';
			case '.bz2':
				return 'fa fa-file-archive-o';
			case '.7z':
				return 'fa fa-file-archive-o';
			case '.mp4':
				return 'fa fa-film';
			case '.m4v':
				return 'fa fa-film';
			case '.mid':
				return 'fa fa-film';
			case '.mkv':
				return 'fa fa-film';
			case '.webm':
				return 'fa fa-film';
			case '.mov':
				return 'fa fa-film';
			case '.avi':
				return 'fa fa-film';
			case '.flv':
				return 'fa fa-film';
			case '.mp3':
				return 'fa fa-music';
			case '.m4a':
				return 'fa fa-music';
			case '.ogg':
				return 'fa fa-music';
			case '.flac':
				return 'fa fa-music';
			case '.pdf':
				return 'fa fa-file-pdf-o';
			case '.ico':
				return 'fa fa-file-image-o';
			case '.sqlite':
				return 'fa fa-database';
			case '.deb':
				return 'fa fa-file-archive-o';
			case '.rpm':
				return 'fa fa-file-archive-o';
			default:
				return 'fa fa-file-o';
		}

	}
}
