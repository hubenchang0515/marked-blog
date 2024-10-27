import { ArticleData } from "./Article"

export interface PreviewProps {
    data: ArticleData
}

export default function Preview(props:PreviewProps) {
    return (
        <div className="card bg-light shadow-sm my-3 p-3" style={{border:0, borderRadius:0}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap'}}>
                <a className="h3 link-emphasis link-underline link-underline-opacity-0 link-underline-opacity-75-hover p-0 m-0" href={`#/detail?category=${props.data.category}&article=${props.data.title}`}>
                    <i className="bi bi-link-45deg me-1"></i>
                    {props.data.title}
                </a>
                <div className="text-body-tertiary">
                    <span className="me-2" style={{whiteSpace:'nowrap'}}>
                        <i className="bi bi-calendar me-1"></i> 
                        {new Date(props.data.modify).toLocaleString()}
                    </span>
                    
                    <span className="me-2" style={{whiteSpace:'nowrap'}}>
                        <i className="bi bi-bookmarks me-1"></i> 
                        <a className="link-secondary" href={`#/summary?category=${props.data.category}`}>{props.data.category}</a>
                    </span>
                </div>
            </div>
        </div>
    )
}