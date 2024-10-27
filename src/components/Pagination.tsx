export interface PaginationProps {
    page: number
    pageCount: number
    urlPrefix: string
    max: number
}

export default function Pagination(props:PaginationProps) {
    const side = Math.floor((props.max - 1) / 2);
    let left = props.page - side;
    let right = props.page + side + 1;

    if (left < 1) {
        right = props.max;
        left = 1;
    } else if (right >= props.pageCount - 1) {
        left = props.pageCount - props.max;
        right = props.pageCount - 1;
    }

    const pages = []
    for (let i = left > 1 ? left : 1; i < right && i < props.pageCount - 1; i++) {
        pages.push(i);
    }

    return (
        <ul className="pagination">
            
            {pages.length > 0 && <li className={props.page === 0 ? "page-item active" : "page-item"}><a className="page-link" href={`${props.urlPrefix}&page=0`}>首页</a></li>}

            {
                pages.map((page) => {
                    return  <li className={props.page === page ? "page-item active" : "page-item"}><a className="page-link" href={`${props.urlPrefix}&page=${page}`}>{page+1}</a></li>
                })
            }

            {pages.length > 0 && <li className={props.page === props.pageCount-1 ? "page-item active" : "page-item"}><a className="page-link" href={`${props.urlPrefix}&page=${props.pageCount-1}`}>尾页</a></li>}
        </ul>
    )
}