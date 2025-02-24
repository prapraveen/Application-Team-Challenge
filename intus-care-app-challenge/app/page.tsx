import Header from "./components/header";
import PptList from "./components/ppt-list";
import History from "./components/history";
import "./app.css";


const Home = () => {
    return <>
        <Header />
        <History />
        <PptList />
    </>
}

export default Home;