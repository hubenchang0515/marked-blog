import { useEffect, useState } from "react";
import  { ArticleData, CategoryData } from "../components/Article";
import CONFIG from "../config";
import { useLocation } from "react-router-dom";
import Preview from "../components/Preview";
import Frame from "../components/Frame";
import Pagination from "../components/Pagination";

export default function Summary() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const page = Number(params.get("page"));
    const pageSize = 20;
    
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [current, setCurrent] = useState<ArticleData[]>([]);

    useEffect(() => {
        fetch(CONFIG.SUMMARY).then(async (response) => {
            if (response.ok) {
                const data:CategoryData[] = await response.json();
                setCategories(data);

                for (const categoryData of data) {
                    if (categoryData.title === category) {
                        setCurrent(categoryData.articles);
                    }
                }
            }
        });
    }, [category, page]);

    return (
        <Frame
            title={CONFIG.TITLE}
            data={categories}
        >
            <div>
                {
                    current.slice(page*pageSize, (page+1)*pageSize).map((item, index) => {
                        return <Preview key={index} data={item}></Preview>
                    })
                }

                <Pagination urlPrefix={`/#/summary?category=${category}`} page={page} pageCount={Math.ceil(current.length / pageSize)} max={6}/>
            </div>
        </Frame>
    )
}
