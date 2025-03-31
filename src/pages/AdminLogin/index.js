import React, { useState, useEffect } from "react";
import { Table, Select, Card } from "antd";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const { Option } = Select;

const AdminLogin = () => {
  const [marksList, setMarkersList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("hindi");
  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    axios.get("/marks/all")
      .then((res) => {
        setMarkersList(res.data || []);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  useEffect(() => {
    if (marksList.length > 0) {
      const defaultClass = marksList[0].studyingclass;
      setSelectedClass(defaultClass);
      setFilteredData(marksList.filter((item) => item.studyingclass === defaultClass));
    }
  }, [marksList]);

  useEffect(() => {
    if (selectedClass) {
      setFilteredData(marksList.filter((item) => item.studyingclass === selectedClass));
    }
  }, [selectedClass, marksList]);

  useEffect(() => {
    if (selectedClass) {
      getAverageMarks();
    }
  }, [selectedClass]);
  
  const [averageMarks, setAverageMarks] = useState([]);

  const getAverageMarks = async () => {
    const uniqueClasses = [...new Set(marksList.map(item => item.studyingclass))];
  
    try {
      const responses = await Promise.all(
        uniqueClasses.map(cls =>
          axios.get(`/averageMarks?studyingclass=${cls}`)
        )
      );

      const avgMarksData = responses.map((res, index) => ({
        avgMarks: res.data
      }));
  
      setAverageMarks(avgMarksData);
  
    } catch (error) {
      console.error("Error fetching average marks:", error);
    }
  };
    
  const getTopStdntMarks = async () => {
    const uniqueClasses = [...new Set(marksList.map(item => item.studyingclass))];
  
    try {
      const responses = await Promise.all(
        uniqueClasses.map(cls =>
          axios.get(`/top-students?studyingclass=${cls}&subject=${selectedSubject}`)
        )
      );

      const topStdntMark = responses.map((res, index) => ({
        topStdntsMarks: res.data
      }));
      
      // setAverageMarks(topStdntMark);
  
    } catch (error) {
      console.error("Error fetching average marks:", error);
    }
  };

  const getBottomStdntMarks = async () => {
    const uniqueClasses = [...new Set(marksList.map(item => item.studyingclass))];
  
    try {
      const responses = await Promise.all(
        uniqueClasses.map(cls =>
          axios.get(`/averageMarks?studyingclass=${cls}&subject=${selectedSubject}`)
        )
      );

      const avgMarksData = responses.map((res, index) => ({
        avgMarks: res.data
      }));
  
      setAverageMarks(avgMarksData);
  
    } catch (error) {
      console.error("Error fetching average marks:", error);
    }
  };

  const calculateStatistics = (subject) => {
    console.log('checking averageMarks', averageMarks);

    const classGroups = {};
    marksList.forEach((item) => {
      if (!classGroups[item.studyingclass]) classGroups[item.studyingclass] = [];
      classGroups[item.studyingclass].push(item[subject]);
    });

    const allMarks = averageMarks.flatMap(item => item.avgMarks);
  
    const filteredData = allMarks.filter(item => 
      item.subject.toLowerCase() === subject.toLowerCase()
    );
    console.log('Filtered data', filteredData);
    return filteredData.map((item) => ({
      class: `Class ${item.studyingclass}`,
      avg: item.avgMarks,
      top3: "N/A", // Modify if needed
      bottom3: "N/A" // Modify if needed
    }));
  };

  const classStats = calculateStatistics(selectedSubject);

  return (
    <div>
      <Card>
        <Select value={selectedClass} onChange={setSelectedClass} style={{ width: 200, marginRight: 10 }}>
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