import { User } from "lucide-react";
import PageContent from "../layouts/PageContent";
import { EmptyState } from "../layouts/ContentComponents";

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
