// slideToggle()
// TODO 修復 -刪除功能
// TODO 修復 -修改功能
// TODO 重置搜索
// TODO 修復 -新增功能
const icons = new Icons();

$(document).ready(function () {
  // alert('abc');
  var url = "ajax/ajaxCard";
  var ajaxobj = new AjaxObject(url, "json");
  ajaxobj.getall();

  // 新增按鈕
  $("#addbutton").click(function () {
    $("#dialog-addconfirm").dialog({
      resizable: true,
      height: $(window).height() * 0.4, // dialog視窗度
      width: $(window).width() * 0.4,
      modal: true,
      buttons: {
        // 自訂button名稱
        新增: function (e) {
          var url = "ajax/ajaxCard";
          var cnname = $("#addcnname").val();
          var enname = $("#addenname").val();
          var sex = $('input:radio:checked[name="addsex"]').val();
          var ajaxobj = new AjaxObject(url, "json");
          ajaxobj.cnname = cnname;
          ajaxobj.enname = enname;
          ajaxobj.sex = sex;
          ajaxobj.add();

          e.preventDefault(); // avoid to execute the actual submit of the form.
        },
        重新填寫: function () {
          $("#addform")[0].reset();
        },
        取消: function () {
          $(this).dialog("close");
        },
      },
    });
  });
  // 搜尋按鈕
  $("#searchbutton").click(function () {
    $("#dialog-searchconfirm").dialog({
      resizable: true,
      height: $(window).height() * 0.4, // dialog視窗度
      width: $(window).width() * 0.4,
      modal: true,
      buttons: {
        // 自訂button名稱
        搜尋: function (e) {
          var url = "ajax/ajaxCard";
          // var data = $("#searchform").serialize();
          var cnname = $("#secnname").val();
          var enname = $("#seenname").val();
          var sex = $('input:radio:checked[name="sesex"]').val();
          var ajaxobj = new AjaxObject(url, "json");
          ajaxobj.cnname = cnname;
          ajaxobj.enname = enname;
          ajaxobj.sex = sex;
          ajaxobj.search();

          e.preventDefault(); // avoid to execute the actual submit of the form.
        },
        重新填寫: function () {
          $("#searchform")[0].reset();
        },
        取消: function () {
          $(this).dialog("close");
        },
      },
    });
  });
  // 重置按鈕
  $("#resetbutton").click(function () {
    ajaxobj.reset();
  });
  // 修改鈕
  $("#cardtable").on("click", ".modifybutton", function () {
    var ajaxobj = new AjaxObject(url, "json");
    ajaxobj.modify_get();
  });
  $("#cardtable").on("click", ".deletebutton", function () {
    var deleteid = $(this).attr("id").substring(12);
    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, "json");
    ajaxobj.id = deleteid;
    ajaxobj.delete();
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
    const strsex = item.sex ? "男" : "女";
    const row = $("<tr></tr>");
    row.append($("<td></td>").html(item.cnname));
    row.append($("<td></td>").html(item.enname));
    row.append($("<td></td>").html(strsex));
    row.append($("<td></td>").html(item.phone));
    row.append($("<td></td>").html(item.email));

    // // 添加編輯鈕
    // row.append(
    //   $("<td></td>").html(
    //     '<button id="modifybutton' +
    //       item.s_sn +
    //       '" class="modifybutton" style="font-size:16px;font-weight:bold;">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'
    //   )
    // );

    // 添加編輯、刪除
    row.append(
      $("<td class='text-center'></td>").html(
        `${icons.penceil(item.s_sn)} ${icons.trash(item.s_sn)}`
      )
    );
    $("#cardtable").append(row);
  });
}

function initEdit(response) {
  var modifyid = $("#cardtable").attr("id").substring(12);
  $("#mocnname").val(response[0].cnname);
  $("#moenname").val(response[0].enname);
  if (response[0].sex == 0) {
    $("#modifyman").prop("checked", true);
    $("#modifywoman").prop("checked", false);
  } else {
    $("#modifyman").prop("checked", false);
    $("#modifywoman").prop("checked", true);
  }
  $("#modifysid").val(modifyid);
  $("#dialog-modifyconfirm").dialog({
    resizable: true,
    height: $(window).height() * 0.4, // dialog視窗度
    width: $(window).width() * 0.4,
    modal: true,
    buttons: {
      // 自訂button名稱
      修改: function (e) {
        // $("#modifyform").submit();
        // 取值
        var url = "ajax/ajaxCard";
        var cnname = $("#mocnname").val();
        var enname = $("#moenname").val();
        var sex = $('input:radio:checked[name="mosex"]').val();
        var ajaxobj = new AjaxObject(url, "json");

        // 填值
        ajaxobj.cnname = cnname;
        ajaxobj.enname = enname;
        ajaxobj.sex = sex;
        ajaxobj.id = modifyid;
        ajaxobj.modify();

        e.preventDefault(); // avoid to execute the actual submit of the form.
      },
      重新填寫: function () {
        $("#modifyform")[0].reset();
      },
      取消: function () {
        $(this).dialog("close");
      },
    },
    error: function (exception) {
      alert("Exeption:" + exception);
    },
  });
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
AjaxObject.prototype.init =
  '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","email":"peter@example.com","phone":"09XXXXXXXX"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","email":"allen@example.com","phone":"09XXXXXXXX"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","email":"sharon@example.com","phone":"09XXXXXXXX"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","email":"yoki@example.com","phone":"09XXXXXXXX"}]';
AjaxObject.prototype.data =
  '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","email":"peter@example.com","phone":"09XXXXXXXX"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","email":"allen@example.com","phone":"09XXXXXXXX"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","email":"sharon@example.com","phone":"09XXXXXXXX"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","email":"yoki@example.com","phone":"09XXXXXXXX"}]';
AjaxObject.prototype.alertt = function () {
  alert("Alert:");
};
/* -------------------------------- AjaxObject method ------------------------------- */
AjaxObject.prototype.getall = function () {
  refreshTable(JSON.parse(this.data));
};
AjaxObject.prototype.add = function () {
  response =
    '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"},{"s_sn":"52","cnname":"新增帳號","enname":"NewAccount","sex":"1"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-addconfirm").dialog("close");
};
AjaxObject.prototype.modify = function () {
  response = '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-modifyconfirm").dialog("close");
};
AjaxObject.prototype.modify_get = function () {
  response =
    '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
  initEdit(JSON.parse(response));
};
AjaxObject.prototype.search = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-searchconfirm").dialog("close");
};
AjaxObject.prototype.delete = function () {
  response =
    '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
  refreshTable(JSON.parse(response));
};
AjaxObject.prototype.reset = function () {
  refreshTable(JSON.parse(this.init));
};

/* ---------------------------------- icons --------------------------------- */
function Icons() {}
Icons.prototype.personPlus = (s_sn) => `
<svg id="deletebutton${s_sn}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
</svg>`;
Icons.prototype.penceil = (s_sn) => `
<svg id="deletebutton${s_sn}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
`;
Icons.prototype.trash = (s_sn) => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
`;
