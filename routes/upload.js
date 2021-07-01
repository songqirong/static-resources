var express = require('express');
var router = express.Router();
// var multiparty = require('multiparty')
var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
router.post('/images',function(req, res, next){
    const { type } = req.query;
    const typeArr = ['banners', 'goods'];
    if(typeArr.includes(type)){
        var form = new formidable.IncomingForm();
        // var form = new multiparty.Form()
        form.parse(req, function(err, fields, files){
            if(err) {
                res.status(500).json({
                    err_code: 'UNKNOW_ERROR',
                    err_msg: '服务器未知错误'
                })
            }else{
                // console.log("files",files)
                const file = files.file
                // const file = files.file[0]
                // 使用fs模块把临时路径中的图片数据，写入到服务器硬盘中
                let readStream = fs.createReadStream(file.path)
                let now = Date.now();
                // let p = path.join(__dirname,'../public/imgs/' + now + '-' + file.originalFilename);
                let p = path.join(__dirname,'../public/images/' + now + '-' + file.name);
                let writeStream = fs.createWriteStream(p);
                readStream.pipe(writeStream);
                writeStream.on('close', function() {
                    let data={
                        msg:'图片上传成功',
                        url: `https://static.persion.cn/images/${type}/${now}-${file.name}`
                    }
                    res.status(200).json({
                        err_code: 0,
                        data
                    })
                })
            }
        })
    } else {
        res.status(422).json({

        })
    }
    
})
module.exports=router
