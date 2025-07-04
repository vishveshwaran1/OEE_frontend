import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Button, DatePicker, Select, Table, Spin, message } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportDownloadPage = () => {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [reportType, setReportType] = useState('production');
    const [reportData, setReportData] = useState(null);
    const [columns, setColumns] = useState([]);

    const reportTypes = [
        { value: 'production', label: 'Production Data' },
        { value: 'hourly-production', label: 'Hourly Production' },
        { value: 'rejections', label: 'Rejections' },
        { value: 'stoptimes', label: 'Stop Times' },
        { value: 'oee', label: 'OEE Data' },
        { value: 'corrections', label: 'Corrections' },
        { value: 'plan-actual', label: 'Plan vs Actual' }
    ];

   const generateColumns = (data) => {
    if (!data || data.length === 0) return [];

    const sampleItem = data[0];

    // Create columns from data keys, excluding _id
    const dynamicColumns = Object.keys(sampleItem)
        .filter(key => key !== '_id')
        .map(key => ({
            title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            dataIndex: key,
            key: key,
        }));

    // Add "S.No" column at the beginning
    return [
        {
            title: 'S.No',
            dataIndex: 'serial',
            key: 'serial',
            render: (_, __, index) => index + 1,
        },
        ...dynamicColumns
    ];
};



    const fetchReport = async () => {
        if (!dateRange || dateRange.length !== 2) {
            message.error('Please select a date range');
            return;
        }

        setLoading(true);
        try {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            
            const response = await axios.get(`https://oee-backend-1.onrender.com/api/reports/${reportType}`, {
                params: { startDate, endDate }
            });

            if (response.data.success) {
                setReportData(response.data.data);
                setColumns(generateColumns(response.data.data));
                message.success('Report data loaded successfully');
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            message.error('Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!reportData || reportData.length === 0) {
            message.warning('No data to download');
            return;
        }
const headers = ['S.No', ...columns.filter(col => col.dataIndex !== 'serial').map(col => col.title)];

const rows = reportData.map((item, index) => {
    const row = [index + 1]; // Serial Number
    columns.filter(col => col.dataIndex !== 'serial').forEach(col => {
        let value = item[col.dataIndex];

        if (value && typeof value === 'object') {
            value = JSON.stringify(value);
        }

        if (moment(value, moment.ISO_8601, true).isValid()) {
            value = `'${moment(value).format('YYYY-MM-DD HH:mm:ss')}'`;
        }

        row.push(value !== undefined ? value : '');
    });
    return row.join(',');
}).join('\n');




        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = `${reportType}_report_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        saveAs(blob, filename);
    };

    const downloadJSON = () => {
        if (!reportData || reportData.length === 0) {
            message.warning('No data to download');
            return;
        }

       const jsonWithSerial = reportData.map((item, index) => ({
    SNo: index + 1,
    ...item
}));
const jsonContent = JSON.stringify(jsonWithSerial, null, 2);

        const blob = new Blob([jsonContent], { type: 'application/json' });
        const filename = `${reportType}_report_${moment().format('YYYYMMDD_HHmmss')}.json`;
        saveAs(blob, filename);
    };
const processedData = reportData
  ? reportData.map((item, index) => ({
        ...item,
        serial: index + 1,
        key: index,
    }))
  : [];

    return (
        <div className="report-page" style={{ padding: '20px' }}>
            <h1>Production Reports</h1>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Select
                    style={{ width: '250px' }}
                    value={reportType}
                    onChange={setReportType}
                >
                    {reportTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                            {type.label}
                        </Option>
                    ))}
                </Select>
                
                <RangePicker
    style={{ width: '300px', height: '40px' }}
    dropdownClassName="custom-calendar-dropdown"
    value={dateRange}
    onChange={setDateRange}
    disabledDate={current => current && current > moment().endOf('day')}
/>

                
                <Button 
                    type="primary" 
                    onClick={fetchReport}
                    disabled={!dateRange || dateRange.length !== 2}
                >
                    Generate Report
                </Button>
                
                <Button 
                    onClick={downloadCSV}
                    disabled={!reportData || reportData.length === 0}
                >
                    Download CSV
                </Button>
                
                <Button 
                    onClick={downloadJSON}
                    disabled={!reportData || reportData.length === 0}
                >
                    Download JSON
                </Button>
            </div>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                    <p>Loading report data...</p>
                </div>
            ) : (
                reportData && (
                    <div style={{ marginTop: '20px' }}>
                        <Table 
    columns={columns} 
    dataSource={processedData}
    scroll={{ x: true }}
    bordered
    size="small"
    // pagination={{ 
    //     pageSize: 10,
    //     showSizeChanger: true
    // }}
/>


                    </div>
                )
            )}
        </div>
    );
};

export default ReportDownloadPage;
