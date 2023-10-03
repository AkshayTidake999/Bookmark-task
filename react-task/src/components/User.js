import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
function User() {
  const [users, setUsers] = useState([]);
  const [bookmarkedUsers, setBookmarkedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/users?per_page=10&page=${page}`
      );
      const data = await response.json();
      // Append new users to the existing list instead of replacing it
      setUsers((prevUsers) => [...prevUsers, ...data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const toggleBookmark = (user) => {
    if (bookmarkedUsers.some((u) => u.id === user.id)) {
      setBookmarkedUsers(bookmarkedUsers.filter((u) => u.id !== user.id));
    } else {
      setBookmarkedUsers([...bookmarkedUsers, user]);
    }
  };

  const debouncedSearch = debounce((text) => setSearchText(text), 300);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.login.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => switchTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'bookmarkedUsers' ? 'active' : ''}
          onClick={() => switchTab('bookmarkedUsers')}
        >
          Bookmarked Users
        </button>
      </div>
      <input
        type="text"
        placeholder="Search User Name Here....."
        value={searchText}
        onChange={handleSearch}
      />
      {activeTab === 'users' && (
        <>
          <h2 className='user-list-head'>Users List</h2>
          {/* <hr style={{width:"700px"}}/> */}
          <ul>
            {filteredUsers.map((user) => (
              <>
              <li key={user.id}>
               <div> <img src={user.avatar_url} alt={`${user.login}'s avatar`} /></div>
               <div> <span className='username'>{user.login}</span></div>
                <div>
                <button className='bookmark-btn-user' onClick={() => toggleBookmark(user)}>
                  {bookmarkedUsers.some((u) => u.id === user.id)
                    ? 'Unbookmark'
                    : 'Bookmark'}
                </button>
                </div>
              </li>
              <hr/>
              </>
            ))}
        
          </ul>
          {loading && <p>Loading...</p>}
          {!loading && (
            <div className='load-more-user' >
                            <button  onClick={handleLoadMore}>Load More</button>

            </div>
          )}
        </>
      )}

      {activeTab === 'bookmarkedUsers' && (
        <>
          <h2 className="bookmark-head">Bookmarked Users</h2>
          <hr style={{width:"600px"}}/>
          <ul>
            {bookmarkedUsers.map((user) => (
              <li className='bookmark-user-name' key={user.id}>
                {user.login}
                <button className='bookmark-user-button' onClick={() => toggleBookmark(user)}>Unbookmark</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default User;
