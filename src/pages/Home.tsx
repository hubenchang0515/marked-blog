import { useEffect, useState } from "react";
import Markdown from "../components/Markdown";
import Article, { ArticleData, CategoryData } from "../components/Article";
import CONFIG from "../config";
import Frame from "../components/Frame";

export default function Home() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [articleData, setArticleData] = useState<ArticleData>();

    useEffect(() => {
        fetch(CONFIG.SUMMARY).then(async (response) => {
            if (response.ok) {
                const categoryDatas:CategoryData[] = await response.json();
                setCategories(categoryDatas);
                const firstArticles:ArticleData[] = []

                for (const categoryData of categoryDatas) {
                    if (categoryData.articles.length > 0) {
                        firstArticles.push(categoryData.articles[0]);
                    }
                }

                if (firstArticles.length > 0) {
                    const firstArticle = firstArticles.sort((x,y) => {
                        return new Date(x.modify).getTime() - new Date(y.modify).getTime();
                    }).reverse()[0];
                    setArticleData(firstArticle)
                }
            }
        });
    }, []);

    return (
        <Frame
            title={CONFIG.TITLE}
            data={categories}
        >
            {
                articleData ? <Article data={articleData}/> : <div className="text-center"><Markdown content={`# 404 Not Found\n\n Location: \`${decodeURI(location.pathname + location.search)}\``}/></div>
            }
        </Frame>
    )
}
