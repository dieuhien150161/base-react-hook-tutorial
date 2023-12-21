import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import _, { debounce } from "lodash";
import "./TableUser.scss";
import { CSVDownload, CSVLink } from "react-csv";
import * as Papa from "papaparse/papaparse.min.js";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  const [dataUserEdit, setdataUserEdit] = useState({});
  const [dataUserDelete, setdataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("");
  const [sortField, setSortField] = useState("id");

  // const [keyword, setKeyword] = useState("");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);

    if (res?.data) {
      setListUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUser = (user) => {
    setdataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleEditUserFormModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setdataUserDelete(user);
  };

  const handleDeleteUserFormModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUsers);
  };

  const handleShort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item?.email?.includes(term)
      );
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 300);

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers?.length > 0) {
      result.push(["Id", "Email", "First name", "Last name"]);
      listUsers.map((item) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });

      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event?.target?.files && event.target?.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("only accept CSV files...");
        return;
      }

      Papa.parse(file, {
        header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            console.log("rawCSV[0]?.length", rawCSV);
            if (Object.keys(rawCSV[0]).length === 5) {
              if (
                Object.keys(rawCSV[0])[1] !== "email" ||
                Object.keys(rawCSV[0])[2] !== "first_name" ||
                Object.keys(rawCSV[0])[3] !== "last_name"
              ) {
                console.log("rawCSV[0]?.length", rawCSV[0][1]);

                toast.error("Wrong format for CSV file");
              } else {
                let result = [];
                rawCSV.map((item) => {
                  if (Object.keys(item).length === 5) {
                    let obj = {};
                    obj.id = item.id;
                    obj.email = item.email;
                    obj.first_name = item.first_name;
                    obj.last_name = item.last_name;
                    result.push(obj);
                  }
                });
                console.log("result", result);
                setListUsers(result);
              }
            } else {
              toast.error("Wrong format for CSV file");
            }
          } else {
            toast.error("Not fount data on CSV file");
          }
          console.log(results.data);
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <span>List Uses:</span>
        <div className="group-btns mt-sm-0 mt-2">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i>Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />
          <CSVLink
            data={dataExport}
            className="btn btn-primary"
            filename={"user.csv"}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i className="fa-solid fa-download"> </i>
            Export
          </CSVLink>
          {/* <CSVDownload data={csvData} target="_blank" /> */}
          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i>
            Add new
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="search by email..."
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID </span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleShort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleShort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Email</th>
              <th>
                <div className="sort-header">
                  <span>First Name </span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleShort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleShort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />

      <ModalEditUser
        show={isShowModalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditUserFormModal={handleEditUserFormModal}
      />

      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFormModal={handleDeleteUserFormModal}
      />

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
    </>
  );
};

export default TableUsers;
