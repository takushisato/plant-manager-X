import Layout from "@/layouts/Layout";
import { MailGroupList } from "@/types/mail-group";
import { useMailGroupStore } from "@/hooks/useMailGroupStore";
import { useEffect } from "react";

const MailCreate = () => {
  const {
    mailGroupList,
    getMailGroupList,
    selectedMailGroup,
    setSelectedMailGroup,
  } = useMailGroupStore();

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
          <p>メールの送信</p>
          <p>選択中のグループ: {selectedMailGroup.group_title}</p>
        </div>
      )}
    </Layout>
  );
};

export default MailCreate;