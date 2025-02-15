import React, { useState, useEffect } from "react";
import { Table, Input, Select, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const navigate = useNavigate();
const [pageSize, setPageSize] = useState(10);
    useEffect(() => {
        fetch("https://randomuser.me/api?results=100&nat=us")
            .then((response) => response.json())
            .then((data) => {
                // Սկզբից տեսակավորում ենք անունները այբենական կարգով
                const sortedUsers = data.results.sort((a, b) =>
                    a.name.first.localeCompare(b.name.first)
                );
                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            });
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
    }, [searchTerm, genderFilter, users]);

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
            sorter: (a, b) => a.name.first.localeCompare(b.name.first), // ✅ Սորտավորում անունով
            sortDirections: ["ascend", "descend"],
            defaultSortOrder: "ascend", // ✅ Սկզբից այբենական կարգով
        },
        {
            title: "Last Name",
            dataIndex: ["name", "last"],
            key: "last",
            sorter: (a, b) => a.name.last.localeCompare(b.name.last),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            sorter: (a, b) => a.gender.localeCompare(b.gender),
            sortDirections: ["ascend", "descend"],
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 200 }}
                />
                <Select
                    placeholder="Filter by Gender"
                    onChange={(value) => setGenderFilter(value)}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </div>

            <Table
                dataSource={[...filteredUsers]}
                columns={columns}
                rowKey={(record) => record.login.uuid}
                pagination={{
                    pageSize: pageSize, // ✅ Նախնական արժեքը 20
                    pageSizeOptions: ["10", "20", "50"], // ✅ Ընտրության համար տարբերակներ
                    showSizeChanger: true,// ✅ Տեսանելի դարձնել ընտրիչը,
                    onShowSizeChange: (current, size) => setPageSize(size)
                }}
            />
        </div>
    );
};

export default UserTable;
