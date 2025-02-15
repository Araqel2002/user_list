import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserTable from "./UserTable";
import UserProfile from "./UserProfile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserTable />} />
                <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
