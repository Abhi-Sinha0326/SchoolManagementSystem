import React, { useState, useEffect } from "react";
import { Table, Select, Card } from "antd";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const { Option } = Select;

// const dummyData = [
//   { id: 1, rollnumber: 101, studyingclass: 5, hindi: 85, english: 78, maths: 92, science: 88 },
//   { id: 2, rollnumber: 102, studyingclass: 5, hindi: 75, english: 82, maths: 79, science: 85 },
//   { id: 3, rollnumber: 103, studyingclass: 6, hindi: 89, english: 88, maths: 95, science: 91 },
//   { id: 4, rollnumber: 104, studyingclass: 6, hindi: 67, english: 74, maths: 80, science: 77 },
//   { id: 5, rollnumber: 105, studyingclass: 7, hindi: 90, english: 85, maths: 87, science: 89 },
//   { id: 6, rollnumber: 106, studyingclass: 7, hindi: 78, english: 80, maths: 82, science: 79 }
// ];

const AdminLogin = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("hindi");
  const [marksList, setMarkersList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    axios.get(`/ims/marks/all`)
      .then((res) => {
        console.log('checking res', res);
        setMarkersList(res.data || []); // Ensure data is set or default to []
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  useEffect(() => {
    if (selectedClass) {
      setFilteredData(marksList.filter((item) => item.studyingclass === selectedClass));
    } else {
      setFilteredData(marksList);
    }
  }, [selectedClass, marksList]);

  const calculateStatistics = (subject) => {
    if (!marksList || marksList.length === 0) return [];

    const classGroups = {};
    marksList.forEach((item) => {
      if (!classGroups[item.studyingclass]) classGroups[item.studyingclass] = [];
      classGroups[item.studyingclass].push(item[subject]);
    });

    return Object.keys(classGroups).map((classNum) => {
      const scores = classGroups[classNum];
      return {
        class: `Class ${classNum}`,
        avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
        top3: scores.sort((a, b) => b - a).slice(0, 3).join(", "),
        bottom3: scores.sort((a, b) => a - b).slice(0, 3).join(", ")
      };
    });
  };

  const classStats = calculateStatistics(selectedSubject);

  return (
    <div>
      <Card>
        <Select placeholder="Select Class" onChange={setSelectedClass} style={{ width: 200, marginRight: 10 }}>
          {[...new Set(marksList.map((item) => item.studyingclass))].map((cls) => (
            <Option key={cls} value={cls}>{`Class ${cls}`}</Option>
          ))}
        </Select>
        <Select value={selectedSubject} onChange={setSelectedSubject} style={{ width: 200 }}>
          {["hindi", "english", "maths", "science"].map((subject) => (
            <Option key={subject} value={subject}>{subject.toUpperCase()}</Option>
          ))}
        </Select>
      </Card>
      <Table
        dataSource={filteredData.sort((a, b) => b[selectedSubject] - a[selectedSubject])}
        columns={[
          { title: "Class No", dataIndex: "studyingclass", key: "studyingclass" },
          { title: "Roll No", dataIndex: "rollnumber", key: "rollnumber" },
          { title: "Hindi", dataIndex: "hindi", key: "hindi" },
          { title: "English", dataIndex: "english", key: "english" },
          { title: "Maths", dataIndex: "maths", key: "maths" },
          { title: "Science", dataIndex: "science", key: "science" }
        ]}
        rowKey="id"
      />
      <h3>Statistics for {selectedSubject.toUpperCase()}</h3>
      <Table
        dataSource={classStats}
        columns={[
          { title: "Class", dataIndex: "class", key: "class" },
          { title: "Average Score", dataIndex: "avg", key: "avg" },
          { title: "Top 3 Scores", dataIndex: "top3", key: "top3" },
          { title: "Bottom 3 Scores", dataIndex: "bottom3", key: "bottom3" }
        ]}
        rowKey="class"
      />
      <h3>Cumulative Average Score per Class</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={classStats}>
          <XAxis dataKey="class" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminLogin;
