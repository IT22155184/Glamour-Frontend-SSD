import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner.jsx";
import TableView from "../../components/table/TableView";
import EditButton from "../../components/button/EditButton";
import DeleteButton from "../../components/button/DeleteButton";
import ViewButton from "../../components/button/ViewButton";
import AddButton from "../../components/button/AddButton";
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";
import AddStoreItem from "./AddStoreItem.jsx";
import DeleteStoreItem from "./DeleteStoreItem.jsx";
import EditStoreItem from "./EditStoreItem.jsx";
import ShowStoreItem from "./ShowStoreItem.jsx";

const StoreItemsList = () => {
  const [loading, setLoading] = useState(true);
  const [storeItems, setStoreItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [item, setItem] = useState({});
  const headers = ["ID", "Name", "Category", "Min Price", "Stock", ""];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/items`)
      .then((response) => {
        setLoading(false);
        setStoreItems(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching store items:", error);
      });
  }, []);

  const loadItems = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/items`)
      .then((response) => {
        setLoading(false);
        setStoreItems(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching store items:", error);
      });
  }
if (loading) {
    return <Spinner />;
  }
  return (
    <div className=" bg-secondary">
      <StoreNavbar pro={true}/>
      <h1 className="my-8 text-6xl font-semibold font-Aboreto text-primary text-center">
        Store Products
      </h1>
      <div className="m-10">
      <AddButton
        onClick={() => {
          setShowAdd(true);
        }}
      />
      </div>
        <div className="px-10 mx-auto">
          <table className="bg-white w-full mx-auto mb-5 font-BreeSerif ">
            <TableView headers={headers} />
            <tbody>
              {storeItems.map((items) => (
                <tr key={items._id} className="h-8">
                  <td className="text-center border rounded-md border-slate-700">
                    {items.productId}
                  </td>
                  <td className="text-center border rounded-md border-slate-700">
                    {items.name}
                  </td>
                  <td className="text-center border rounded-md border-slate-700">
                    {items.category}
                  </td>
                  <td className="text-center border rounded-md border-slate-700">
                    {items.minprice}
                  </td>
                  <td className="text-center border rounded-md border-slate-700">
                    {items.stock}
                  </td>
                  <td className="text-center border rounded-md border-slate-700">
                    <div className="flex justify-center m-2 gap-x-4">
                      <ViewButton
                        onClick={() => {
                          setShowView(true);
                          setItem(items);
                        }}
                      />
                      <EditButton
                        onClick={() => {
                          setShowEdit(true);
                          setItem(items);
                        }}
                      />
                      <DeleteButton
                        onClick={() => {
                          setShowDelete(true);
                          setItemId(items._id);
                        }}
                        className="mr-2"
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {showAdd && <AddStoreItem onClose={() =>  setShowAdd(false)} onAdd={()=>  loadItems()} />}
      {showDelete && (
        <DeleteStoreItem id={itemId} onClose={() => setShowDelete(false)} onDelete={()=>  loadItems()}/>
      )}
      {showEdit && (
        <EditStoreItem item={item} onClose={() =>  setShowEdit(false) } onEdit={()=>  loadItems()} />
      )}
      {showView && (
        <ShowStoreItem item={item} onClose={() => setShowView(false)} />
      )}

      <StaffFooter />
    </div>
  );
};

export default StoreItemsList;
