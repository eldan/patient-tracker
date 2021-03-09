import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form } from "react-bootstrap";
// import { useLocation } from "react-router-dom";
import { db } from "./../../Comm/firebase";
import { useAuth } from "./../../contexts/AuthContext";

const ManageUsers = () => {
  const [getUsers, setUsers] = useState({});
  const [getFocusUser, setFocusUser] = useState(null);
  // const [ setModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // useEffect(() => {
  //   //Fetch data for user Property
  //   console.log("Fetch data for user Property");
  //   try {
  //     var ref = db.ref("users/");
  //     ref
  //       .orderByChild("email")
  //       .equalTo(getFocusUser)
  //       .on("value", function (dataSnapshot) {
  //         if (dataSnapshot.toJSON() != null) {
  //           setFocusUserData(
  //             dataSnapshot.toJSON()[Object.keys(dataSnapshot.toJSON())]
  //           );
  //         } else {
  //           console.log("no users: no result");
  //         }
  //       });
  //   } catch (e) {
  //     console.log("error " + e);
  //     // return <GetUser />;
  //   }
  // }, [getFocusUser]);

  // const openModal = () => {
  //   setModal(true);
  // };

  // const closeModal = () => {
  //   setModal(false);
  // };
  const { getUserOrgs } = useAuth();
  // const location = useLocation();

  // //TODO change gthis ugly way of retrieve the ID
  // const orgId = location.pathname.replace("/manageusers/", "");
  // const orgName = getUserOrgs[orgId].name;

  const loadUsers = () => {
    try {
      var ref = db.ref("users/"); //TODO not exactly yhe best cause admin gets all users includes not his own
      ref.on("value", function (dataSnapshot) {
        if (dataSnapshot.toJSON() !== null) {
          setUsers(dataSnapshot.toJSON());
        } else {
          // console.log("loadPatients: no result");
        }
      });
    } catch (e) {
      // console.log("error " + e);
    }
  };
  const handleUserProperty = (user, userID) => {
    const obj = user;
    obj["id"] = userID;
    setFocusUser(obj);
  };

  const handleCloseModalUserDetail = () => {
    setFocusUser(null);
  };

  const Users = () => {
    return Object.keys(getUsers).map((id) => {
      let isPending = "Pending...";
      if (getUsers[id].orgs !== undefined && getUsers[id].orgs !== null) {
        isPending = "ok";
      }

      return (
        <tr>
          <td>
            <div onClick={() => handleUserProperty(getUsers[id], id)}>
              <Button variant="link" href="#">{getUsers[id].email}</Button>
            </div>
          </td>
          <td>
            <div>{isPending}</div>
          </td>
        </tr>
      );
    });
  };

  // const GetOrgNameForAdmin = () => {
  //   return (
  //     <span>
  //       <b>{orgName}</b>
  //     </span>
  //   );
  // };

  function checkBoxClicked(ev, user, orgID) {
    if (ev.target.checked) {
      assignUserToOrg(user, orgID);
    } else {
      unAssignUserFromOrg(user, orgID);
    }
  }
  function assignUserToOrg(user, orgID) {
    const usrID = user.email;
    const reff1 = db.ref("users/" + user.id + "/orgs/" + orgID);
    const data = {
      default: "true",
      name: getUserOrgs[orgID].name,
    };
    reff1
      .set(data, function (error) {
        if (error) {
          // console.log("reff1: " + error);
        }
      })
      .then((res) => {
        /* ADD TO Organisations */
        const reff2 = db.ref("organisations/" + orgID + "/users/" + user.id);
        reff2.set(usrID, function (error) {
          if (error) {
            // console.log("reff2: " + error);
          } else {
            // console.log("user Assigned ok. ");
          }
        });
      });
  }
  function unAssignUserFromOrg(user, orgID) {
    const reff1 = db.ref("users/" + user.id + "/orgs/" + orgID);
    reff1
      .remove(function (error) {
        if (error) {
          console.log("reff1: " + error);
        }
      })
      .then((res) => {
        /* ADD TO Organisations */
        const reff2 = db.ref("organisations/" + orgID + "/users/" + user.id);

        reff2.set(null, function (error) {
          if (error) {
            // console.log("reff3: " + error);
          } else {
            // console.log("user UNassigned ok. ");
          }
        });
      });
  }

  function isThisOrgAssignedToUser(orgIDToSearch, user) {
    var rslt = true;
    // console.log(orgIDToSearch);
    // console.log(Object.keys(user.orgs));
    if (user.orgs) {
      var filterData = Object.keys(user.orgs).filter((item) =>
        item.includes(orgIDToSearch)
      );
    } else {
      return false;
    }

    if (filterData.length === 0) {
      rslt = false;
    }
    return rslt;
  }

  function isAdminOnOrg(orgIDToSearch, user) {
    if (user.orgs !== undefined && user.orgs[orgIDToSearch] !== undefined) {
      if (user.orgs[orgIDToSearch]["admin"] !== undefined) {
        return true;
      }
    }
    return false;
  }

  return (
    <Container>
      {/* {showModal ? (
        <NewUser
          handleCloseModalNewPatient={closeModal}
          orgId={orgId}
          key={orgId}
          orgName={orgName}
        />
      ) : null} */}

      {getFocusUser !== null ? (
        <Modal show={true}>
          <Modal.Header>
            <Modal.Body>
              <Form.Label>
                EMAIL: <b>{getFocusUser.email}</b>
              </Form.Label>
              <br />
              <hr />
              <Form.Label>
                Title: <b>{getFocusUser.title}</b>
              </Form.Label>
              <br />
              <Form.Label>
                P. Name: <b>{getFocusUser.privateName}</b>
              </Form.Label>
              <br />
              <Form.Label>
                F. Name: <b>{getFocusUser.familyName}</b>
              </Form.Label>
              <br />
              <hr />

              <Form.Label>Assign Organisations</Form.Label>
              <Form.Group>
                {Object.keys(getUserOrgs).map(function (key) {
                  return (
                    <Form.Check
                      type="checkbox"
                      key={getUserOrgs[key].name}
                      label={getUserOrgs[key].name}
                      defaultChecked={isThisOrgAssignedToUser(
                        key,
                        getFocusUser
                      )}
                      disabled={isAdminOnOrg(key, getFocusUser)}
                      onClick={(ev) => checkBoxClicked(ev, getFocusUser, key)}
                    />
                    //TODO getUserOrgs too much info, should be stripped in db
                  );
                })}
              </Form.Group>
            </Modal.Body>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="link" onClick={handleCloseModalUserDetail}>
              סגור
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
      <br />
      <br />
      <br />
      <h4>Manage users</h4>

      {/* <Button variant="primary" onClick={() => openModal()}>
        Add User
      </Button> */}
      <Table striped hover>
        <thead>
          <tr>
            <th>Email/Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <Users />
        </tbody>
      </Table>
      {/* <UserDetails /> */}
    </Container>
  );
};

export default ManageUsers;
