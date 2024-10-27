import { CategoryData } from "../components/Article"
import Nav from "../components/Nav";
import Footer from "./Footer";

export interface FrameProps {
    title: string
    data: CategoryData[]
    children?: JSX.Element
}

export default function Frame(props:FrameProps) {
    const items = props.data.sort((x,y) => x.articles.length - y.articles.length).reverse().map((category) => {
        return {
            text: `${category.title}(${category.articles.length})`, 
            url:`#/summary?category=${category.title}`
        };
    })
    return (
        <div style={{minHeight:'100%', display:'flex', flexDirection:'column'}}>
            <Nav 
                title={props.title}
                items={items.length <= 10 ? items : [...items.slice(0,10), {text:"更多", url: "#/category"}]}
            />

            <main className="container-xl" style={{backgroundColor:'rgba(255,255,255,0.8)'}}>
                <div className="mt-3 mb-3">
                {
                    props.children
                }
                </div>
            </main>

            <div style={{flexGrow: 1}}></div>

            <Footer/>
        </div>
    );
}