module.exports = function(){
	var defaults = {
		type: 'css',
		identity: 'base64',
		path : './',
        dest : './dest/',
        charset : 'utf8'
	},
	_ = require('underscore'),
    cssRegx = /.+.css$/,
	fs = require('fs');
	var img2base = {
		decode : function(opts){
            var len, i, sub, fileName;
            opts = _.extend({},defaults,opts);
            opts.path += (opts.path[opts.path.length - 1] == '/' ? '' : '/');
            opts.dest += (opts.dest[opts.dest.length - 1] == '/' ? '' : '/');
			var fileList = fs.readdirSync(opts.path);
            if (len = fileList.length) {
               for (i = 0; i < len; i++) {
                   sub = fs.statSync(opts.path + fileList[i]);
                   if (sub.isFile()) {
                       fileName = fileList[i];
                       if (cssRegx.test(fileName)) {
                           scanCss(opts.path + fileName, opts);
                       }
                   } else {
                       img2base.decode({path : opts.path + fileList[i] + '/'});
                   }
               }
            }
		}
	}
    function scanCss(filePath, opts){
        var cssStr, lastIndex = 0, index = 0,
            len,
            destFile = destPath(filePath, opts.dest);
        if (!fs.existsSync(destFile)) {
            // create dir and file
            createDir(destFile, opts.charset);
        }
        cssStr = fs.readFileSync(filePath, opts.charset).toString();
        len = cssStr.length;
        while((index = cssStr.indexOf('\n', lastIndex)) != -1){
            fs.appendFileSync(destFile, decodeImg(cssStr.substring(lastIndex, ++index), opts.identity, filePath), opts.charset);
            lastIndex = index;
        }
        if (lastIndex < len) {
            fs.appendFileSync(destFile, decodeImg(cssStr.substring(lastIndex, len + 1), opts.identity, filePath), opts.charset);
        }
    }
    function decodeImg(express, indentity, cssPath){
        var index = 0;
        if ((index = express.indexOf('url(')) !== -1) {
            var imgUrl = express.substring(index + 4, express.indexOf(')'));
            if (imgUrl.indexOf(indentity) > 0) {
                return express.substring(0, index + 4) + toBaseString(imgUrl, cssPath.substring(0, cssPath.lastIndexOf('/') + 1)) + express.substring(express.indexOf(')'));
            }
        }
        return express;
    }
    function destPath(filepath, destdir){
        var path = '';
        if (filepath[0] != '.') {
            path = filepath;
        } else {
            path = filepath.substr(filepath.indexOf('/') + 1);
        }
        return destdir + path;
    }
    function createDir(path, charset){
        var pathList = path.split('/'),
            len = pathList.length - 1,
            curPath = '';
        for (var i = 0; i < len; i++) {
            curPath += pathList[i];
            if (false === fs.existsSync(curPath)) {
                fs.mkdirSync(curPath);
            }
            curPath += '/';
        }
        fs.writeFileSync(path, '', charset);
        return curPath;
    }
    function caculatePath(path, dir){
        var pIndex = path.indexOf('?');
        pIndex != -1 && (path = path.substring(0, pIndex));
        // trim ' or "
        if (path[0] == '\'' || path[0] == '"') {
            path = path.substring(1);
        }
        if (path[path.length - 1] == '\'' || path[path.length - 1] == '"') {
            path = path.substring(0, path.length - 1);
        }
        if (path[0] == '.') {

        } else {
            return dir + '/' + path;
        }
    }
    function toBaseString(imgPath, cssdir){
        imgPath = imgPath.trim();
        try {
            var filePath = caculatePath(imgPath, cssdir);
            var suffixs = filePath.split('.');
            return 'data:image/' + suffixs[suffixs.length - 1] + ';base64,' + fs.readFileSync(caculatePath(imgPath, cssPath)).toString('base64');
        } catch(err){
            console.log(err);
        }
        return imgPath;
    }
    return img2base;
}();