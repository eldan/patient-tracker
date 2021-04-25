import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form } from "react-bootstrap";
import { db } from './../../services/firebase';
import { useAuth } from "./../../contexts/AuthContext";

const ManageUsers = (props) => {
  const [getUsers, setUsers] = useState({});
  const [getFocusUser, setFocusUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);
  
  const { getUserOrgs } = useAuth();

  const loadUsers = () => {
    try {
      var ref = db.ref("users/"); //TODO remove current admin user from list
      ref.on("value", function (dataSnapshot) {
        if (dataSnapshot.toJSON() !== null) {
          setUsers(dataSnapshot.toJSON());
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
        <tr key={id}>
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
            // user Assigned successfully
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
            props.handleSetError(19);
          } else {
            // user Un-assigned successfully
          }
        });
      });
  }

  function isThisOrgAssignedToUser(orgIDToSearch, user) {
    var rslt = true;
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
                      type='checkbox'
                      key={getUserOrgs[key].name}
                      label={getUserOrgs[key].name}
                      defaultChecked={isThisOrgAssignedToUser(key, getFocusUser)}
                      disabled={isAdminOnOrg(key, getFocusUser)}
                      onClick={(ev) => checkBoxClicked(ev, getFocusUser, key)}
                    />
                    //TODO getUserOrgs retrieve only needed data
                  );
                })}
              </Form.Group>
            </Modal.Body>
          </Modal.Header>
          <Modal.Footer>
            <Button variant='link' onClick={handleCloseModalUserDetail}>
              סגור
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
      <h4 className='pt-5'>Manage users</h4>
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
    </Container>
  );
};

export default ManageUsers;
