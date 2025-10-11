import { EmptyState, PageContent } from "@/shared/layouts";
import { User } from "lucide-react";

const AccountPage = () => {
  return (
    <PageContent title="Account" icon={User}>
      <EmptyState
        title="Account Page"
        description="Account management features coming soon"
      />
    </PageContent>
  );
};

export default AccountPage;
