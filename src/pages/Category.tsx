import { useEffect, useState } from "react";
import { CategoryData } from "../components/Article";
import CONFIG from "../config";
import Frame from "../components/Frame";

export default function Category() {
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        fetch(CONFIG.SUMMARY).then(async (response) => {
            if (response.ok) {
                const categoryDatas:CategoryData[] = await response.json();
                categoryDatas.sort((x,y) => x.articles.length - y.articles.length).reverse()
                setCategories(categoryDatas);
            }
        });
    }, []);

    return (
        <Frame
            title={CONFIG.TITLE}
            data={categories}
        >
            <div style={{display:'flex', flexWrap:'wrap'}}>
                {
                    categories.map((item, index) => {
                        return <a className="mx-2 link-secondary link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-75-hover" key={index} href={`#/summary?category=${item.title}`}>{item.title}({item.articles.length})</a>
                    })
                }
            </div>
        </Frame>
    )
}
