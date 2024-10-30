import { useEffect, useRef } from "react";
import * as marked from "marked";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';
import "github-markdown-css/github-markdown.css"

export interface MarkdownProps {
    content: string
}

export default function Markdown(props:MarkdownProps) {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (divRef.current) {
            divRef.current.innerHTML = marked.parse(props.content) as string;
            hljs.highlightAll();
        }
        
    });
    return (
        <div ref={divRef} className="markdown"></div>
    )
}