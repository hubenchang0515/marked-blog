import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import Detail from "./pages/Detail";
import Category from "./pages/Category";

function App() {
    return (
        <Routes>
            <Route key="home" path="/" element={<Home/>}/>
            <Route key="home" path="/category" element={<Category/>}/>
            <Route key="home" path="/summary" element={<Summary/>}/>
            <Route key="home" path="/detail" element={<Detail/>}/>
        </Routes>
    )
}

export default App
