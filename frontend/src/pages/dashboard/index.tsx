import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/dashboard/statistics',
            permanent: false,
        },
    }
}

export default function DashboardIndex() {
    return null
}