import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, history } from "umi";
import docs from "@public/docsStructure";
const { Header, Content, Sider } = Layout;

const topMenus: MenuProps["items"] = docs.map((item) => {
  let newItem = { ...item }; // 先复制整个对象
  delete newItem.children; // 删除 'children' 属性
  return newItem;
});

const items3 = ["Home", "List", "App"];
const App: React.FC = () => {
  const [sideMenus, setSideMenus] = useState(docs[0].children);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const sideMenuClick: MenuProps["onClick"] = (e) => {
    console.log("sideMenuClick ", e);
    // history.push("/article", { articlePath: e.key });
    history.push(
      {
        pathname: "/article",
        search: "?articlePath=" + e.key,
        hash: "#test",
      },
      { articlePath: e.key }
    );
  };

  const topMenuClick: MenuProps["onClick"] = (e) => {
    console.log("topMenuClick ", e);
    const currentItems = docs.find((item) => item.key == e.key);
    setSideMenus(currentItems.children || []);
  };

  if (
    window.location.pathname === "/index" ||
    window.location.pathname === "/"
  ) {
    // 如果是特殊页面，则移除 layout
    document.body.style.padding = "0";
    return <Outlet />;
  }

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={topMenus}
          style={{ flex: 1, minWidth: 0 }}
          onClick={topMenuClick}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={sideMenus}
            onClick={sideMenuClick}
          />
        </Sider>
        <Layout style={{ position: "relative", padding: "0 15px 15px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={items3.map((item) => ({ title: item }))}
          ></Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
