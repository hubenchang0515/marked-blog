import { useLocation } from "react-router-dom";
import Article, { ArticleData, CategoryData } from "../components/Article"
import { useEffect, useState } from "react";
import CONFIG from "../config";
import Frame from "../components/Frame";
import Markdown from "../components/Markdown";

export default function Detail() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const article = params.get("article");

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [articleData, setArticleData] = useState<ArticleData>();
    const [prev, setPrev] = useState<ArticleData>();
    const [next, setNext] = useState<ArticleData>();

    useEffect(() => {
        setArticleData(undefined);
        setPrev(undefined);
        setNext(undefined);
        fetch(CONFIG.SUMMARY).then(async (response) => {
            if (response.ok) {
                const categoryDatas:CategoryData[] = await response.json();
                setCategories(categoryDatas);

                TOP_LOOP:
                for (const categoryData of categoryDatas) {
                    if (categoryData.title !== category) {
                        continue;
                    }

                    for (let i = 0; i < categoryData.articles.length; i++) {
                        const articleData = categoryData.articles[i];
                        if (articleData.title === article) {
                            setArticleData(articleData);
                            if (i > 0) {
                                setPrev(categoryData.articles[i-1]);
                            }

                            if (i + 1 < categoryData.articles.length) {
                                setNext(categoryData.articles[i+1]);
                            }

                            break TOP_LOOP;
                        }
                    }
                }
            }
        });
    }, [category, article]);

    return (
        <Frame
            title={CONFIG.TITLE}
            data={categories}
        >
            {
                articleData ? <Article data={articleData} prev={prev} next={next}/> : <div className="text-center"><Markdown content={`# 404 Not Found\n\n Location: \`${decodeURI(location.pathname + location.search)}\``}/></div>
            }
        </Frame>
    );
}