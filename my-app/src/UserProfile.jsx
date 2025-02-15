import {useLocation} from "react-router-dom";
import {Avatar, Card} from "antd";

const UserProfile = () => {
    const location = useLocation();
    const user = location.state?.user; // Ստանում ենք user-ի տվյալները

    if (!user) return <h2>No user data available</h2>;

    return (
        <Card title={`${user.name.first} ${user.name.last}`} style={{ width: 400, margin: "auto", textAlign: "center" }}>
            <Avatar src={user.picture.large} size={100} />
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Location:</strong> {user.location.city}, {user.location.country}</p>
        </Card>
    );
};

export default UserProfile;
