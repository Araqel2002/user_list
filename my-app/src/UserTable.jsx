import React, { useState, useEffect } from "react";
import { Table, Input, Select, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const UserTable = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
    const [genderFilter, setGenderFilter] = useState(localStorage.getItem("genderFilter") || "");
    const [pageSize, setPageSize] = useState(parseInt(localStorage.getItem("pageSize")) || 10);
    const [loading, setLoading] = useState(false);

    // Fetch users from the API
    const fetchUsers = async () => {
        setLoading(true);
        let url = `https://randomuser.me/api/?results=100&nat=us`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            let sortedUsers = data.results.sort((a, b) => a.name.first.localeCompare(b.name.first));

            // Save users to localStorage
            localStorage.setItem("users", JSON.stringify(sortedUsers));

            setUsers(sortedUsers);
            setFilteredUsers(sortedUsers);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
            setFilteredUsers(JSON.parse(storedUsers));
        } else {
            fetchUsers();
        }
    }, []);


    useEffect(() => {
        let filtered = [...users];

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name.last.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (genderFilter) {
            filtered = filtered.filter(user => user.gender === genderFilter);
        }

        setFilteredUsers(filtered);

        // Save filters to localStorage
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("genderFilter", genderFilter);
        localStorage.setItem("pageSize", pageSize);
    }, [searchTerm, genderFilter, pageSize, users]);


    const columns = [
        {
            title: "Avatar",
            dataIndex: "picture",
            key: "avatar",
            render: (picture, record) => (
                <Avatar
                    src={picture.thumbnail}
                    alt="User Avatar"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/user/${record.login.uuid}`, { state: { user: record } })}
                />
            ),
        },
        {
            title: "First Name",
            dataIndex: ["name", "first"],
            key: "first",
            sorter: (a, b) => a.name.first.localeCompare(b.name.first),
        },
        {
            title: "Last Name",
            dataIndex: ["name", "last"],
            key: "last",
            sorter: (a, b) => a.name.last.localeCompare(b.name.last),
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            sorter: (a, b) => a.gender.localeCompare(b.gender),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
                <Search
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 200 }}
                />
                <Select
                    placeholder="Filter by Gender"
                    value={genderFilter || undefined}
                    onChange={(value) => setGenderFilter(value)}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </div>

            <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey={(record) => record.login.uuid}
                pagination={{
                    pageSize: pageSize,
                    pageSizeOptions: ["10", "20", "50"],
                    showSizeChanger: true,
                    onShowSizeChange: (current, size) => setPageSize(size),
                }}
                loading={loading}
            />
        </div>
    );
};

export default UserTable;
