"use strict";

async function getData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postData(url, data) {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });
    return await result.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function putData(url, data) {
  try {
    const result = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });
    return await result.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export { getData, postData, putData };
