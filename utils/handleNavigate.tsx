import { useRouter } from "next/navigation";
type User = {
  _id: string;
  token: string;
};

export default function useNavigation() {
  const router = useRouter();
  const handleNavigate = (route: string, user: User) => {
    const authenticationStatus = user?._id ? "logged-in" : "not-logged-in";
    const authenticationToken = `${user?.token}`;
    if (user?._id && user?.token) {
      location.href = `/${user?._id}/${route}?authenticationStatus=${authenticationStatus}&&authenticationToken=${authenticationToken}`;
    }
  };
  const handleQuickNavigate = (route: string, user: User) => {
    const authenticationStatus = user?._id ? "logged-in" : "not-logged-in";
    const authenticationToken = `${user?.token}`;
    const authenticationID = `${user?._id}`;
    if (user?._id && user?.token) {
      router.push(
        `/${user?._id}/${route}?authenticationStatus=${authenticationStatus}&&authenticationID=${authenticationID}&&authenticationToken=${authenticationToken}`,
        { scroll: false }
      );
      router.refresh();
    }
  };
  return { handleNavigate, handleQuickNavigate };
}
