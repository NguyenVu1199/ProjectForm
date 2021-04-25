import {
  Card,
  DataTable,
  Pagination,
  Layout,
  DisplayText,
  Button,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import "@shopify/polaris/dist/styles.css";
import { useEffect, useState } from "react";
import callApi from "../callApi/callApi";
const ListUser = (props) => {
  const [checkAll, setCheckedAll] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortFullName, setSortFullName] = useState(false);
  const [sortEmail, setSortEmail] = useState(false);
  const [sortPhone, setSortPhone] = useState(false);
  const [sortAddress, setAddress] = useState(false);
  const [search, setSearch] = useState();
  const [btnNext, setBtnNext] = useState(true);
  const [btnPrev, setBtnPrev] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortUsersFN = () => {
    setSortFullName(!sortFullName);
  };
  const sortUsersEmail = () => {
    setSortEmail(!sortEmail);
  };
  const sortUsersPhone = () => {
    setSortPhone(!sortPhone);
  };
  const sortUserAddress = (data) => {
    setAddress(!sortAddress);
  };
  const searchData = (data) => {
    if (search === null || search === "" || search === undefined) {
      if (sortFullName) {
        data = data.sort(function (a, b) {
          if (a.fullname < b.fullname) {
            return -1;
          }
          if (a.fullname > b.fullname) {
            return 1;
          }
          return 0;
        });
      }
      if (!sortFullName) {
        data = data.sort(function (a, b) {
          if (a.fullname > b.fullname) {
            return -1;
          }
          if (a.fullname < b.fullname) {
            return 1;
          }
          return 0;
        });
      }
     
      return data;
    } else {
      const col = data[0] && Object.keys(data[0]);
      return data.filter((row) =>
        col.some(
          (column) =>
            row[column].toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      );
    }
  };
  const currentItems = searchData(data).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const onDeleteSelectedRow = () => {
    if (window.confirm("Are you sure about that?")) {
      setData(data.filter((item) => item.isChecked !== "true"));
      const arrDelete = data.filter((item) => item.isChecked !== "false");
      if (!checkAll) {
        for (let x in arrDelete) {
          if (arrDelete[x].isChecked === "true") {
            setTimeout(async () => {
              await callApi(
                `listUsers/${arrDelete[x].id}`,
                "DELETE",
                null
              ).then((err) => {});
            }, 500);
            continue;
          }
        }
      } else {
        for (let x in data) {
          callApi(`listUsers/${data[x].id}`, "DELETE").then((err) => {
            console.log(err);
          });
        }
      }
      alert("Delete multiple Successfully!");
    }
  };
  const onDeleteUser = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you about that?")) {
      await callApi(`listUsers/${id}`, "DELETE", null, {
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.log("axios error:", error);
      });
      setData(data.filter((item) => item.id !== id));
      alert("Delete Account Successfully!");
    }
  };
  const onNextPage = () => {
    setCurrentPage(currentPage + 1);
    var total = currentPage * 5 + currentItems.length;
    if (total >= searchData(data).length) {
      setBtnNext(false);
      setBtnPrev(true);
    } else {
      setBtnPrev(true);
    }
  };
  const onPrevPage = () => {
    setCurrentPage(currentPage - 1);
    if (currentPage === 2 || currentPage === 1) {
      setBtnNext(true);
      setBtnPrev(false);
    } else {
      setBtnNext(true);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  const onChangeKeySearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const onReset = () => {
    setBtnNext(true);
    setBtnPrev(false);
    if (search !== undefined) setSearch("");
  };
  const fetchAllData = () => {
    fetch(`https://606efb3f0c054f0017658138.mockapi.io/api/listUsers`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .then((err) => {
        console.log(err);
      });
  };
  const checkBoxAll = async () => {
    setCheckedAll(!checkAll);
  };
  function countItemsSelect() {
    var count = 0;
    for (let x in data) {
      if (data[x].isChecked === "true") {
        count++;
      }
    }
    return count;
  }
  const editStatusItems = async (id, test) => {
    await callApi(
      `listUsers/${id}`,
      "PUT",
      {
        isChecked: test,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.log("axios error:", error);
    });
    fetchAllData();
  };
  var rows = [];
  currentItems.forEach((item) => {
    rows.push([
      <div key={item.id}>
        <input
          type="checkbox"
          value={item.id}
          onChange={() =>
            editStatusItems(
              item.id,
              item.isChecked === "true" ? "false" : "true"
            )
          }
          checked={checkAll ? true : item.isChecked === "true" ? true : false}
        ></input>
      </div>,
      item.id,
      item.fullname,
      item.email,
      item.phone,
      <a
        href={`https://www.google.com/maps/place/${item.address
          .split(/[$&+,:;=?@#|'<>.^*()%!-]/)
          .join("+")}`}
        target="_blank"
        rel="noreferrer"
      >
        {item.address}
      </a>,
      <div className="actions">
        <Button primary>
          <Link to={`/edit/user/${item.id}`}>Edit</Link>
        </Button>{" "}
        <Button
          destructive
          onClick={() => {
            onDeleteUser(item.id);
          }}
        >
          Delete
        </Button>
      </div>,
    ]);
  });

  return (
    <div className="table">
      <Layout>
        <Layout.Section>
          <DisplayText className="create_user" size="medium">
            User List
          </DisplayText>
          <br></br>
          <div className="flex">
            <div>
              {searchData(data).length > 0 && (
                <Pagination
                  label={`${currentPage}/${Math.ceil(
                    searchData(data).length / itemsPerPage
                  )}`}
                  hasPrevious={btnPrev}
                  onPrevious={() => {
                    onPrevPage();
                  }}
                  hasNext={btnNext}
                  onNext={() => {
                    onNextPage();
                  }}
                />
              )}
            </div>
            {(countItemsSelect() > 0 || checkAll) && (
              <div className="delRowSelect">
                <Button destructive onClick={() => onDeleteSelectedRow()}>
                  Delete Selected
                </Button>
              </div>
            )}
            <div className="form-search">
              <div className="input_search">
                <input
                  id="search"
                  className="form-control"
                  onChange={(e) => onChangeKeySearch(e.target.value)}
                  value={search}
                  type="text"
                  placeholder="Enter your key search..."
                />
              </div>
              <div className="btn_search">
                <Button onClick={onReset} primary>
                  Reset
                </Button>
              </div>
            </div>
          </div>
          <br />
          <div className="list">
            <Card>
              <DataTable
                columnContentTypes={[
                  "",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                  "text",
                ]}
                headings={[
                  <input
                    type="checkbox"
                    checked={checkAll}
                    onChange={checkBoxAll}
                  ></input>,
                  <span>#ID</span>,
                  <span onClick={sortUsersFN}>Full Name &#8597;</span>,
                  <span onClick={sortUsersEmail}>Email </span>,
                  <span onClick={sortUsersPhone}>Phone  </span>,
                  <span onClick={sortUserAddress}>Address</span>,
                  <span>Actions</span>,
                ]}
                rows={rows}
              />
            </Card>
          </div>
          <br />
          <br />
        </Layout.Section>
      </Layout>
    </div>
  );
};
export default ListUser;
