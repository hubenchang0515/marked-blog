
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

// 当前文件路径
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章路径
const BLOG_PATH = path.join(__dirname, "../public/blog");
const SUMMARY_PATH = path.join(BLOG_PATH, "summary.json");
const ARTICLE_PATH = path.join(BLOG_PATH, "article");

// 忽略的文件
const FILTER = ["README.md"]

function datetime() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} +0000`;
}

// 获取文件的创建时间（第一次 git commit 的时间）
async function getFileCreateTime(filepath) {
    return new Promise((resolve, reject) => {
        exec(`git log --reverse --format="%ai" -- '${filepath}'`, (err, stdout, stderr) => {
            if (err || stdout.trim().length === 0) {
                resolve(datetime());
            } else {
                const times = stdout.trim().split("\n");
                if (times.length > 0) {
                    resolve(times[0]);
                } else {
                    resolve(datetime());
                }
            }
        });
    });
}

// 获取文件的修改时间（最后一次 git commit 的时间）
async function getFileModifyTime(filepath) {
    return new Promise((resolve, reject) => {
        exec(`git log --format="%ai" -- '${filepath}'`, (err, stdout, stderr) => {
            if (err || stdout.trim().length === 0) {
                resolve(datetime());
            } else {
                const times = stdout.trim().split("\n");
                if (times.length > 0) {
                    resolve(times[0]);
                } else {
                    resolve(datetime());
                }
            }
        });
    });
}

// 读取文章列表
fs.readdir(ARTICLE_PATH, async (err, categories) => {
    if (err) {
        console.error(err)
        return;
    }

    const summary = [];
    let n = categories.length;
    for (const category of categories) {
        const dirpath = path.join(ARTICLE_PATH, category);
        const stat = fs.statSync(dirpath);

        if (stat.isDirectory()) {
            fs.readdir(dirpath, async (err, articles) => {
                if (err) {
                    console.error(err);
                    n = n-1;
                    return;
                }

                const categoryItem = {
                    title: category,
                    articles: []
                };
                for (const article of articles) {
                    const filepath = path.join(dirpath, article);
                    const articleItem = {
                        title: path.parse(filepath).name,
                        category: category,
                        filepath: filepath,
                        url: `/blog/article/${category}/${article}`,
                        create: await getFileCreateTime(filepath),
                        modify: await getFileModifyTime(filepath),
                    };
                    categoryItem.articles.push(articleItem);
                    console.log(articleItem);
                }
                categoryItem.articles.sort((x, y) => new Date(x.modify).getTime() - new Date(y.modify).getTime()).reverse();
                summary.push(categoryItem);
                
                n = n-1;
                if (n === 0) {
                    fs.writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        
                        console.log("DONE!");
                    });
                }
            });
        } else {
            n = n-1;
        }
    }

    
});