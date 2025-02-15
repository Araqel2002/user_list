import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const UserPage = () => {
    const location = useLocation();
    const user = location.state?.user;

    if (!user) {
        return <Title level={3}>User not found</Title>;
    }

    return (
        <div className="user-container">
            <Card className="user-card">
                <Avatar src={user.picture.large} size={100} />
                <Title level={4}>{user.name.first} {user.name.last}</Title>
                <Text>Email: {user.email}</Text>
                <br />
                <Text>Gender: {user.gender}</Text>
                <br />
                <Text>Location: {user.location.city}, {user.location.country}</Text>
            </Card>
        </div>
    );
};

export default UserPage;
