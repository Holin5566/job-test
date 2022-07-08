// TODO 修復 -刪除功能
// TODO 修復 -修改功能
// TODO 重置搜索
// TODO 修復 -新增功能

const icons = new Icons();
var url = "ajax/ajaxCard";
var ajaxobj = new AjaxObject(url, "json");
$(document).ready(function () {
  // alert('abc');

  ajaxobj.getall();
  /* ----------------------------------- 新增按鈕 ---------------------------------- */
  $("#plusbutton").click(function () {
    $(".alert").remove();
  });
  $("#addbutton").click(function () {
    $(".alert").remove();
    const data = JSON.parse(ajaxobj.data);
    const newPerson = {
      cnname: $("#addcnname").val(),
      enname: $("#addenname").val(),
      email: $("#addemail").val(),
      phone: $("#addphone").val(),
      sex: $("#addman").prop("checked") ? 0 : 1,
      s_sn: parseInt(data.at(-1).s_sn) + 1,
    };
    if (!ajaxobj.isValid(newPerson)) return;
    ajaxobj.add(newPerson);
    $("#dialog-add").modal("hide");
  });
  /* --------------------------------- 搜索按鈕 --------------------------------- */
  $("#searchbar").keyup(function (e) {
    const query = e.target.value;
    ajaxobj.search(query);
  });
  /* ---------------------------------- 編輯按鈕 ---------------------------------- */
  $("#dialog-modify").on("click", ".modifybutton", function () {
    const modifyid = $("#modify-sid").val().slice(-2);
    const newData = {
      cnname: $("#mocnname").val(),
      enname: $("#moenname").val(),
      email: $("#moemail").val(),
      phone: $("#mophone").val(),
      sex: $("#modifyman").prop("checked") ? 0 : 1,
      s_sn: modifyid,
    };
    if (!ajaxobj.isValid(newData)) return;
    $(".alert").remove();
    ajaxobj.modify(newData);
    $("#dialog-modify").modal("hide");
  });
  /* ---------------------------------- 刪除按鈕 ---------------------------------- */
  $("#dialog-delete").on("click", ".deletebutton", function () {
    const deleteid = $("#delete-sid").val().slice(12);
    ajaxobj.delete(deleteid);
  });
  // 自適應視窗
  $(window).resize(function () {
    var wWidth = $(window).width();
    var dWidth = wWidth * 0.4;
    var wHeight = $(window).height();
    var dHeight = wHeight * 0.4;
    $("#dialog-confirm").dialog("option", "width", dWidth);
    $("#dialog-confirm").dialog("option", "height", dHeight);
  });
});
function refreshTable(data) {
  // var HTML = '';
  $("#cardtable tbody > tr").remove(); // 清空

  // data = response
  $.each(data, function (key, item) {
    const strsex = item.sex == 0 ? "男" : "女";
    const row = $("<tr></tr>");
    row.append($(`<td class='cnname'></td>`).html(item.cnname));
    row.append($(`<td class='enname'></td>`).html(item.enname));
    row.append($(`<td class='sex'></td>`).html(strsex));
    row.append($(`<td class='phone'></td>`).html(item.phone));
    row.append($(`<td class='email'></td>`).html(item.email));
    // 添加編輯、刪除
    row.append(
      $("<td class='iconbtn'></td>").html(
        `${icons.penceil(item.s_sn)} ${icons.trash(item.s_sn)}`
      )
    );
    $("#cardtable").append(row);

    // 新增列 hover 效果
    const addColHover = (tdClass) =>
      $("." + tdClass).hover(
        () => $("." + tdClass).each((i, td) => td.classList.add("hover")),
        () => $("." + tdClass).each((i, td) => td.classList.remove("hover"))
      );
    const classLi = ["cnname", "enname", "sex", "phone", "email"];
    classLi.forEach((clas) => addColHover(clas));
  });

  /* --------------------------------- delete --------------------------------- */
  // 新增 dialog 功能
  $(".bi-trash").each((i, svg) => svg.setAttribute("data-bs-toggle", "modal"));
  $(".bi-trash").each((i, svg) =>
    svg.setAttribute("data-bs-target", `#dialog-delete`)
  );
  // initDelete
  // 傳送 s_sn
  $(".bi-trash").each((i, svg) => {
    const cur_id = svg.id.slice(12);
    const target = JSON.parse(ajaxobj.data).find(
      (person) => person.s_sn == cur_id
    );
    svg.onclick = () => {
      $(".alert").remove();
      initDelete(target);
      $("#delete-sid").val(svg.id);
    };
  });
  /* ---------------------------------- edit ---------------------------------- */
  // 新增 dialog 功能
  $(".bi-pencil-square").each((i, svg) =>
    svg.setAttribute("data-bs-toggle", "modal")
  );
  $(".bi-pencil-square").each((i, svg) =>
    svg.setAttribute("data-bs-target", `#dialog-modify`)
  );
  // 傳送 s_sn
  $(".bi-pencil-square").each((i, svg) => {
    svg.onclick = () => {
      $(".alert").remove();
      $("#modify-sid").val(svg.id);
      const cur_id = svg.id.slice(12);
      const target = JSON.parse(ajaxobj.data).find(
        (person) => person.s_sn == cur_id
      );
      initEdit(target);
    };
  });
}

function initEdit(response) {
  $("#mocnname").val(response.cnname);
  $("#moenname").val(response.enname);
  $("#moemail").val(response.email);
  $("#mophone").val(response.phone);
  if (response.sex == 0) {
    $("#modifyman").prop("checked", true);
    $("#modifywoman").prop("checked", false);
  } else {
    $("#modifyman").prop("checked", false);
    $("#modifywoman").prop("checked", true);
  }
  $("#modifysid").val(response.s_sn);
}
function initDelete(person) {
  const contain = $("#delete-detail");
  $("#delete-detail > p").remove();
  contain.append(`<p><span>姓名</span>: ${person.cnname} ${person.enname}</p>`);
  contain.append(
    `<p><span>性別</span>: ${person.sex === "0" ? "男" : "女"}</p>`
  );
  contain.append(`<p><span>信箱</span>: ${person.email}</p>`);
  contain.append(`<p><span>電話</span>: ${person.phone}</p>`);
}

/**
 *
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
  this.url = url;
  this.datatype = datatype;
}
AjaxObject.prototype.cnname = "";
AjaxObject.prototype.enname = "";
AjaxObject.prototype.sex = "";
AjaxObject.prototype.id = 0;
AjaxObject.prototype.email = "";
AjaxObject.prototype.phone = "";
AjaxObject.prototype.error = "";
AjaxObject.prototype.init =
  '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","email":"peter@example.com","phone":"0925974158"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","email":"allen@example.com","phone":"0989651475"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","email":"sharon@example.com","phone":"0987451366"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","email":"yoki@example.com","phone":"0955488745"}]';
AjaxObject.prototype.data =
  '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","email":"peter@example.com","phone":"0925974158"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","email":"allen@example.com","phone":"0989651475"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","email":"sharon@example.com","phone":"0987451366"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","email":"yoki@example.com","phone":"0955488745"}]';
AjaxObject.prototype.alertt = function () {
  alert("Alert:");
};
/* -------------------------------- AjaxObject method ------------------------------- */
AjaxObject.prototype.getall = function () {
  refreshTable(JSON.parse(this.data));
};
AjaxObject.prototype.add = function (newPerson) {
  const newData = JSON.parse(this.data);
  newData.push(newPerson);
  console.log(newData);
  this.data = JSON.stringify(newData);
  refreshTable(newData);
};
AjaxObject.prototype.modify = function (target) {
  const newData = JSON.parse(this.data);
  const index = newData.findIndex((person) => person.s_sn == target.s_sn);
  newData[index] = target;
  console.log(newData);
  this.data = JSON.stringify(newData);
  refreshTable(newData);
};
AjaxObject.prototype.modify_get = function () {
  response =
    '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
  initEdit(JSON.parse(response));
};
AjaxObject.prototype.search = function (query) {
  const data = JSON.parse(ajaxobj.data);
  const newData = data.filter((person) => {
    let isMatch = false;
    for (key in person) {
      if (person[key].includes(query)) {
        isMatch = true;
      }
    }
    return isMatch;
  });
  refreshTable(newData);
};
// AjaxObject.prototype.delete = function () {
//   response =
//     '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
//   refreshTable(JSON.parse(response));
// };
AjaxObject.prototype.delete = function (sid) {
  const newData = JSON.parse(this.data).filter((person) => person.s_sn !== sid);
  this.data = JSON.stringify(newData);
  refreshTable(newData);
};
AjaxObject.prototype.reset = function () {
  refreshTable(JSON.parse(this.init));
};
AjaxObject.prototype.isValid = function (form) {
  const en_to_cn = {
    cnname: "姓名(中)",
    enname: "姓名(英)",
    email: "信箱",
    phone: "電話",
  };
  // 必填
  for (let key in form) {
    if (form[key] === "") {
      $(".alert").remove();
      $("#addBody").prepend(`
      <div class="alert alert-danger" role="alert">
      請填入:${en_to_cn[key]}
      </div>`);
      return false;
    }
  }
  // 信箱格式
  if (!form?.email.includes("@") || !form?.email.includes(".com")) {
    $(".alert").remove();
    $(".modal-body").prepend(`
    <div class="alert alert-danger" role="alert">
    信箱格式錯誤
    </div>`);
    return false;
  }
  // 電話格式
  if (form?.phone.length !== 10 || isNaN(form?.phone * 1)) {
    $(".alert").remove();
    $(".modal-body").prepend(`
    <div class="alert alert-danger" role="alert">
    電話格式錯誤
    </div>`);
    return false;
  }

  $(".alert").remove();
  return true;
};

/* ---------------------------------- icons --------------------------------- */
function Icons() {}
Icons.prototype.personPlus = (s_sn) => `
<svg id="modifybutton${s_sn}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
</svg>`;
Icons.prototype.penceil = (s_sn) => `
<svg id="modifybutton${s_sn}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
`;
Icons.prototype.trash = (s_sn) => `
<svg id="deletebutton${s_sn}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
`;
