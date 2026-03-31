
const UserDetails = async ({ params }: { params: Promise<{ id: string }>}) => {
    const { id } = await params;

    return (
        <div className="uppercase font-bold font-serif text-2xl">User #{id} details</div>
    )
}
export default UserDetails
