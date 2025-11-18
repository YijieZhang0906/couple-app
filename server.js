// 引入所需模块
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// 允许跨域，方便你未来两台电脑访问
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// 提供静态文件（你的前端网页）
app.use(express.static(__dirname));

// 数据文件路径
const dataFilePath = path.join(__dirname, 'appData.json');

/**
 * GET /getData 读取 appData.json 的内容
 */
app.get('/getData', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取数据失败', details: err });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            res.status(500).json({ error: 'JSON 解析失败', details: parseErr });
        }
    });
});

/**
 * POST /saveData 保存新数据到 appData.json
 */
app.post('/saveData', (req, res) => {
    const newData = req.body;

    fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: '保存失败', details: err });
        }
        res.json({ success: true });
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，端口：${PORT}`);
});

