import { useEffect, useState } from "react"
import Markdown from "./Markdown"
import CONFIG from "../config"

export interface ArticleData {
    title: string
    category: string
    filepath: string
    url: string
    create: string
    modify: string
}

export interface CategoryData {
    title: string
    articles: ArticleData[]
}

export interface ArticleProps {
    data: ArticleData
    prev?: ArticleData
    next?: ArticleData
}

export default function Article(props:ArticleProps) {
    const [content, setContent] = useState("# Loading");
    useEffect(() => {
        fetch(`${CONFIG.PREFIX}/${props.data.url}`).then(async (response) => {
            if (response.ok) {
                setContent(await response.text());
            }
        });
    }, [props.data.url]);

    return (
        <div className="card shadow p-3" style={{borderRadius: 0}}>
            <div className="text-center">
                <h1 className="text-body-secondary">{props.data.title}</h1>
                <div className="text-body-tertiary">
                    <span className="me-2" style={{whiteSpace:'nowrap'}}>
                        <i className="bi bi-calendar me-1"></i> 
                        {new Date(props.data.modify).toLocaleString()}
                    </span>
                    
                    <span className="me-2" style={{whiteSpace:'nowrap'}}>
                        <i className="bi bi-cake me-1"></i> 
                        {new Date(props.data.create).toLocaleString()}
                    </span>
                    
                    <span className="me-2"  style={{whiteSpace:'nowrap'}}>
                        <i className="bi bi-bookmarks me-1"></i> 
                        <a className="link-secondary" href={`#/summary?category=${props.data.category}`}>{props.data.category}</a>
                    </span>
                </div>
            </div>

            <div className="pb-5"/>

            <Markdown content={content}/>

            {(props.prev || props.next) && <hr/>}

            <div className="row">
                <div className="col  text-start">
                {
                    props.prev && 
                    <a className="link-secondary" href={`#/detail?category=${props.prev.category}&article=${props.prev.title}`}>
                        <i className="bi bi-chevron-double-left mx-2"></i>
                        <span>{props.prev.title}</span>
                    </a>
                }
                </div>
                
                <div className="col text-end">
                {
                    props.next && 
                    <a className="link-secondary" href={`#/detail?category=${props.next.category}&article=${props.next.title}`}>
                        <span>{props.next.title}</span>
                        <i className="bi bi-chevron-double-right mx-2"></i>
                    </a>
                }
                </div>
            </div>
        </div>
    )
}