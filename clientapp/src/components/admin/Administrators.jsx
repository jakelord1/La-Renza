import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Table, Pagination } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Admins`;

const Administrators = () => {
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження адміністраторів');
      const data = await res.json();
      setAdministrators(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = administrators.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(administrators.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

    if (startPage > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      pages.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    pages.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return pages;
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Адміністратори</h2>
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-5 mb-4" style={{maxWidth: 800, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі адміністратори</h4>
        </div>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" style={{ color: '#6f42c1' }}>
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div style={{ minHeight: '340px' }}>
              {currentItems.length === 0 ? (
                <div className="text-muted text-center py-5">Адміністраторів ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Ідентифікатор</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(admin => (
                      <tr key={admin.id}>
                        <td>
                          <div className="fw-bold">{admin.Email || admin.email}</div>
                        </td>
                        <td>{admin.Identifier || admin.identifier}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {administrators.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0">
                  {renderPagination()}
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Administrators; 