class UsersController < ApplicationController
  respond_to :html

  def show
    redirect_to action: :edit
  end

  def edit
    @user = User.find(params[:id])
    respond_with @user
  end

  def update
    if User.find(params[:id]).update_attributes(user_params)
      redirect_to controller: :index, action: :show
    else
      render 'edit'
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email)
  end

end
