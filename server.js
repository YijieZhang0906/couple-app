const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// 提供静态文件（index.html 等）
app.use(express.static(__dirname));

// 数据文件路径
const dataFilePath = path.join(__dirname, 'appData.json');

/**
 * 统一的读取函数
 */
function handleGetData(req, res) {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      // 如果文件不存在，返回一个空对象
      if (err.code === 'ENOENT') {
        return res.json({});
      }
      return res
        .status(500)
        .json({ error: '读取数据失败', details: err.message });
    }
    try {
      const jsonData = JSON.parse(data || '{}');
      res.json(jsonData);
    } catch (parseErr) {
      res
        .status(500)
        .json({ error: 'JSON 解析失败', details: parseErr.message });
    }
  });
}

/**
 * 统一的保存函数
 */
function handleSaveData(req, res) {
  const newData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: '保存失败', details: err.message });
    }
    res.json({ success: true });
  });
}

// 🔹 支持旧路径：/app-data
app.get('/app-data', handleGetData);
app.post('/app-data', handleSaveData);

// 🔹 支持新路径：/api/app-data
app.get('/api/app-data', handleGetData);
app.post('/api/app-data', handleSaveData);

// 端口：Render 用环境变量，本地用 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器已启动，端口：${PORT}`);
});
