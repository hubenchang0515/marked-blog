import { useLocation } from "react-router-dom";

export interface NavItem {
    text: string
    url: string
}

export interface NavProps {
    title: string
    items: NavItem[]
}

export default function Nav(props:NavProps) {
    const location = useLocation();
    
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm" style={{position:'sticky', top:0, left:0, right: 0, zIndex:99}}>
            <a className="btn btn-light navbar-brand" href="https://github.com/hubenchang0515/marked-blog">
                <i className="bi bi-github"></i>
            </a>

            <a className="navbar-brand" href="#/">{props.title}</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                        location.pathname === "/" ? <a className="nav-link active" href="#/">主页</a> : <a className="nav-link" href="#/">主页</a>
                    }

                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            目录
                        </a>
                        <ul className="dropdown-menu">
                            {
                                props.items.map((item, index) => {
                                    return <li key={index}><a className="dropdown-item" href={item.url}>{item.text}</a></li>
                                })
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}