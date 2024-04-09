const followRequests = [
    { sender: "followertest", receiver: "user1" },
    { sender: "followertest", receiver: "user2" },
    { sender: "followertest2", receiver: "user1" },
    { sender: "followertest2", receiver: "followertest" },
    { sender: "followertest3", receiver: "user2" },
    { sender: "followertest3", receiver: "followertest2" },
  ];
  
  async function addFollowRequests() {
    for (const request of followRequests) {
      try {
        // Send follow request
        const response = await fetch("http://localhost:8000/api/followapi/makeFollowRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });
  
        if (response.ok) {
          console.log(`Follow request sent: ${request.sender} -> ${request.receiver}`);
  
          // Accept follow request
          const acceptResponse = await fetch("http://localhost:8000/api/followapi/handleFollowRequest", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: request.sender,
              receiver: request.receiver,
              accept: "true",
            }),
          });
  
          if (acceptResponse.ok) {
            console.log(`Follow request accepted: ${request.sender} -> ${request.receiver}`);
          } else {
            const contentType = acceptResponse.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const error = await acceptResponse.json();
              console.error(`Error accepting follow request: ${error.message}`);
            } else {
              console.error(`Error accepting follow request: ${acceptResponse.status} ${acceptResponse.statusText}`);
            }
          }
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            console.error(`Error sending follow request: ${error.message}`);
          } else {
            console.error(`Error sending follow request: ${response.status} ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error(`Error sending/accepting follow request: ${error.message}`);
      }
    }
  }
  
  addFollowRequests();