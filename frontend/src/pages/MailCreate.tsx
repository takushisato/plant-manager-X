import Layout from "@/layouts/Layout";
import { MailGroupList } from "@/types/mail";
import { useMailStore } from "@/hooks/useMailStore";
import { useEffect } from "react";

const MailCreate = () => {
  const {
    mailGroupList,
    getMailGroupList,
    selectedMailGroup,
    setSelectedMailGroup,
  } = useMailStore();

  useEffect(() => {
    getMailGroupList();
  }, []);

  const handleSelectedMailGroup = (mailGroup: MailGroupList) => {
    setSelectedMailGroup(mailGroup);
    console.log("選択中のグループ:", mailGroup);
  };

  return (
    <Layout>
      <div>
        <p>メールグループの選択</p>
        {mailGroupList.map((mailGroup) => (
          <div
            key={mailGroup.id}
            onClick={() => handleSelectedMailGroup(mailGroup)}
            style={{
              padding: "8px",
              cursor: "pointer",
              backgroundColor:
                selectedMailGroup?.id === mailGroup.id ? "#e6fffa" : "",
            }}
          >
            {mailGroup.group_title}
          </div>
        ))}
      </div>

      {/* ← 条件付き表示 */}
      {selectedMailGroup && (
        <div style={{ marginTop: "24px" }}>
          <p>選択中のグループ: {selectedMailGroup.group_title}</p>
          {/* メールのタイトル入力 */}
          <input type="text" placeholder="タイトル" />
          {/* メールの本文入力 */}
          <textarea placeholder="本文" />
          {/* メールの送信ボタン */}
          <button>送信</button>
        </div>
      )}
    </Layout>
  );
};

export default MailCreate;