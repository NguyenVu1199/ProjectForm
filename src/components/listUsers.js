import {
  Card,
  DataTable,
  Link,
  Pagination,
  Layout,
  DisplayText,
  Button,
  Checkbox,
} from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import { useEffect, useState } from "react";
import callApi from "../callApi/callApi";
const ListUser = (props) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [search, setSearch] = useState();
  const [btnNext, setBtnNext] = useState(true);
  const [btnPrev, setBtnPrev] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const searchData = (data) => {
    if (search === null || search === "" || search === undefined) {
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
  const onDeleteUser = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Bạn có chắc chắn xóa không?")) {
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
    fetch(`https://606efb3f0c054f0017658138.mockapi.io/api/listUsers`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .then((err) => {
        console.log(err);
      });
  }, []);
  const onChangeKeySearch = (value) => {
    setSearch(value);
    console.log(search);
    setCurrentPage(1);
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
          checked={item.isChecked === "true" ? true : false}
        ></input>
      </div>,
      item.id,
      item.fullname,
      item.email,
      item.phone,
      <Link removeUnderline key={item.address}>
        <a
          href={`https://www.google.com/maps/place/${item.address
            .split(/[$&+,:;=?@#|'<>.^*()%!-]/)
            .join("+")}`}
          target="_blank"
          rel="noreferrer"
        >
          {item.address}
        </a>
      </Link>,
      <div>
        <Button primary>
          <Link removeUnderline url={`/edit/user/${item.id}`}>
            Edit
          </Link>
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
            <div className="form-search">
              <input
                id="search"
                className="form-control"
                onChange={(e) => onChangeKeySearch(e.target.value)}
                value={search}
                type="text"
                placeholder="Enter your key search..."
              />
              <Button primary>Search</Button>
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
                  <Checkbox></Checkbox>,
                  "STT",
                  "Full Name",
                  "Email",
                  "Phone",
                  "Address",
                  "Actions",
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
